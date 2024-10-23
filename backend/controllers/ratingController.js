// ratingController.js

import Rating from '../models/ratingModel.js';
import Recipe from '../models/recipeModel.js';

// Add a rating for a recipe
const addRating = async (req, res) => {
    const { recipeId, rating } = req.body;
    const userId = req.user._id; // Assumes req.user contains user info from auth middleware

    try {
        // Check if the user has already rated this recipe
        const existingRating = await Rating.findOne({ recipeId, userId });
        if (existingRating) {
            return res.status(400).json({ success: false, message: 'You have already rated this recipe' });
        }

        // Create and save a new rating
        const newRating = new Rating({ recipeId, userId, rating });
        await newRating.save();

        // Recalculate and update the average rating for the recipe
        const ratings = await Rating.find({ recipeId });
        const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;
        await Recipe.findByIdAndUpdate(recipeId, { averageRating });

        res.status(201).json({ success: true, message: 'Rating added successfully', rating: newRating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error adding rating', error });
    }
};

// Get the average rating for a recipe
const getAverageRating = async (req, res) => {
    const { recipeId } = req.params;

    try {
        const ratings = await Rating.find({ recipeId });
        const averageRating = ratings.length
            ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
            : 0;

        res.status(200).json({ success: true, averageRating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching average rating', error });
    }
};

export { addRating, getAverageRating };
