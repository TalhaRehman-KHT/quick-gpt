import express from "express";
import Chat from "../models/Chat.js";

export const creatChat = async (req, res) => {
    try {

        const userId = req.user._id;

        // Chat data structure
        const chatData = {
            userId,
            message: [],
            name: "new Chat",
            userName: req.user.name
        };

        // Save to DB
        await Chat.create(chatData);

        res.json({ success: true, message: "Chat Created" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getChat = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find chats by userId and sort latest first
        const chat = await Chat.find({ userId }).sort({ updatedAt: -1 });

        res.json({ success: true, chat });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const deleteChat = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId } = req.body; // chatId must come from request body

        // Delete only if the chat belongs to the logged-in user
        await Chat.deleteOne({ _id: chatId, userId });

        res.json({ success: true, message: "Chat Deleted" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};