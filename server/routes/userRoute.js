import express from 'express'
import { getPublishedImage, getUser, login, register } from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';


const userRoute = express.Router();

userRoute.post("/register", register)
userRoute.post("/login", login)
userRoute.post("/data", protect, getUser)
userRoute.post("/published-images", protect, getPublishedImage)


export default userRoute;