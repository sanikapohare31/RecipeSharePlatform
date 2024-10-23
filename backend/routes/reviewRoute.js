import express from "express"
const reviewRouter = express.Router();
import { addReview,getReviewsForRecipe } from "../controllers/reviewController.js";
import authMiddleware from "../middleware/auth.js";

// POST /reviews - Add a new review for a recipe
reviewRouter.post('/', authMiddleware, addReview);

// GET /reviews/:recipeId - Get all reviews for a specific recipe
reviewRouter.get('/:recipeId', getReviewsForRecipe);

export default reviewRouter;
