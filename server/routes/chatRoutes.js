import express from 'express';
import { creatChat, getChat, deleteChat } from '../controllers/ChatController.js';
import { protect } from '../middlewares/auth.js';

const chatRouter = express.Router();

// Create a new chat
chatRouter.post('/create', protect, creatChat);

// Get all chats for a user
chatRouter.get('/get', protect, getChat);

// Delete a chat
// chatRouter.delete('/delete', protect, deleteChat);
chatRouter.delete('/delete', protect, deleteChat);

export default chatRouter;
