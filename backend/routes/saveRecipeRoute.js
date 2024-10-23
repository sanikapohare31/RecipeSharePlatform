import express from "express";
import { addToSaveCollection,removeFromSaveCollection,fetchSavedRecipeData } from "../controllers/saveRecipesController.js";
import authMiddleware from "../middleware/auth.js";

const saveRecipeRouter = express.Router();
saveRecipeRouter.post("/add",authMiddleware,addToSaveCollection);
saveRecipeRouter.post("/remove",authMiddleware,removeFromSaveCollection);
saveRecipeRouter.get("/get",authMiddleware,fetchSavedRecipeData);
export default saveRecipeRouter;
