import Review from "../models/reviewModel.js";

// Add a review for a recipe
const addReview = async (req, res) => {
    const { recipeId, review } = req.body;
    const createdBy= req.user._id; // Assumes req.user contains user info from auth middleware

    try {
        // Create and save a new review
        const newReview = new Review({ recipeId, createdBy, review });
        await newReview.save();

        res.status(201).json({ success: true, message: 'Review added successfully', review: newReview });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error adding review', error });
    }
};

// Get all reviews for a specific recipe
const getReviewsForRecipe = async (req, res) => {
    const { recipeId } = req.params;

    try {
        // Retrieve all reviews for the given recipe and populate with username
        const reviews = await Review.find({ recipeId }).populate('createdBy');

        res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error retrieving reviews', error });
    }
};

export { addReview, getReviewsForRecipe };
