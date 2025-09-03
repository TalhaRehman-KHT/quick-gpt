import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";


// Generate Tokken

const generateToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// Create User
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExits = await User.findOne({ email });
        if (userExits) {
            return res.json({ success: false, message: "User Already Exist" });
        }

        const user = await User.create({ name, email, password });

        // ✅ pass user._id to generateToken
        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

//  Login User 
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password)

            if (isMatch) {
                const token = generateToken(user._id);

                return res.json({ success: true, token })
            }

        }
        return res.json({ success: false, message: "Invalid Email or password" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}




// Get User Data
export const getUser = async (req, res) => {
    try {
        const user = req.user;
        return res.json({ success: true, user })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}




export const getPublishedImage = async (req, res) => {
    try {

        const publishedImage = await Chat.aggregate([
            { $unwind: `$messages` },
            {
                $match: {
                    "message.isImage": true,
                    "message.isPublished": true
                }
            },
            {
                $project: {
                    _id: 0,
                    imageUrl: '$messages.content',
                    userName: '$userName'
                }
            }
        ])

        res.json({
            succeess: true,
            images: publishedImage.reverse()
        })

    } catch (error) {
        res.json({ succeess: false, message: error.message })
    }
}