import express from 'express'
import { getPublishedImage, getUser, login, register } from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';


const userRoute = express.Router();

userRoute.post("/register", register)
userRoute.post("/login", login)
userRoute.get("/data", protect, getUser)
//userRoute.get("/published-images", getPublishedImage)
userRoute.get("/published-images", getPublishedImage);

export default userRoute;