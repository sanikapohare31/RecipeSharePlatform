import mongoose from 'mongoose';

const RatingSchema = new mongoose.Schema({
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }, // 1 to 5 stars
    createdAt: { type: Date, default: Date.now }
});

const Rating =mongoose.models.Rating || mongoose.model('Rating', RatingSchema);
export default Rating;
