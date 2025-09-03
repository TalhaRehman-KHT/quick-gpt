import express from "express"
import { protect } from "../middlewares/auth.js";
import { imageMessageController, textMessageController } from "../controllers/messageController.js";

const messageRouter = express.Router();

// Changed from GET to POST for sending messages
messageRouter.post('/text', protect, textMessageController);
messageRouter.post('/image', protect, imageMessageController);

export default messageRouter;