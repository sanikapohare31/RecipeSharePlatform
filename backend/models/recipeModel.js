import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description:{type:String, required:true},
    ingredients: [{ type: String }], 
    instructions: [{ type: String, required: true }],
    category:{type:String,required:true},
    cuisine: { type: String, required: true },
    dietaryPreferences: [{ type: String }], 
    cookingTime: { type: Number, required: true }, 
    difficulty: { type: Number, required: true }, 
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date, default: Date.now }, 
    image:{type:String,required:true},
    status: { type: String, enum: ['pending', 'approved','rejected'], default: 'pending' },
});

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe",recipeSchema);
export default Recipe;
