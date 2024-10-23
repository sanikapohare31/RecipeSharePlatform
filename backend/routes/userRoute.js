import express from "express";
import { fetchUserDetails, loginUser,registerUser } from "../controllers/userController.js";

const userRouter = express.Router();
userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/:userId",fetchUserDetails)
export default userRouter;