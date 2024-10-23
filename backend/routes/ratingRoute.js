import express from "express";
const ratingRouter = express.Router();
import { addRating, getAverageRating } from '../controllers/ratingController.js';
import authMiddleware from "../middleware/auth.js";

// POST /ratings - Add a new rating
ratingRouter.post('/', authMiddleware, addRating);

// GET /ratings/:recipeId/average - Get average rating for a recipe
ratingRouter.get('/:recipeId/average', getAverageRating);

export default ratingRouter;
