import mongoose from "mongoose";
import validator from "validator";
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // You can add other fields as needed for the admin's functionality
    verifiedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }], // Reference to verified recipes
    managedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Reference to managed users
}, { timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
export default Admin;
