import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    review: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
},{ strictPopulate: false });

const Review =mongoose.models.Review || mongoose.model('Review', ReviewSchema);
export default Review;
