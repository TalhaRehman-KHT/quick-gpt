import axios from "axios";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import imagekit from "../configs/imagekit.js";
import openai from "../configs/openai.js";


export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId, prompt } = req.body;

        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) {
            return res.json({ succeess: false, message: "Chat not found" });
        }

        chat.message.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false,
        });

        // Call OpenAI
        const { choices } = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                { role: "user", content: prompt },
            ],
        });

        const reply = {
            ...choices[0].message,
            timestamp: Date.now(),
            isImage: false
        };

        chat.message.push(reply);
        await chat.save();

        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

        res.json({ succeess: true, reply });
    } catch (error) {
        res.json({ succeess: false, message: error.message });
    }
};



export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;

        // Check user credits
        if (req.user.credits < 2) {
            return res.json({ success: false, message: "You don't have enough credits to use this feature" });
        }

        const { prompt, chatId, isPublished } = req.body;

        // Find the chat document by userId and chatId
        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) {
            return res.json({ success: false, message: "Chat not found" });
        }

        // Push the user message into chat history
        chat.message.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false,
        });

        // Encode prompt for URL safety
        const encodePrompt = encodeURIComponent(prompt);

        // Construct ImageKit AI-generated image URL
        const generateImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodePrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

        // Fetch image bytes
        const aiImageResponse = await axios.get(generateImageUrl, { responseType: "arraybuffer" });

        // Convert to Base64 for upload
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString("base64")}`;

        // Upload image to ImageKit media library
        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "quickgpt",
        });

        // Create assistant's reply
        const reply = {
            role: "assistant",
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished,
        };

        // Add reply to chat history
        chat.message.push(reply);
        await chat.save();

        // Deduct 2 credits from user
        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

        // Return success
        res.json({ success: true, reply });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

