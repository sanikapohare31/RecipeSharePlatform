import User from "../models/userModel.js";

// Add a recipe to the saved collection
const addToSaveCollection = async (req, res) => {
    try {
        const userId = req.user._id; // Authenticated user ID
        const { recipeId } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { savedRecipes: recipeId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("Updated savedRecipes:", user.savedRecipes);
        res.status(200).json({ message: "Recipe added to saved collection", savedRecipes: user.savedRecipes });
    } catch (error) {
        res.status(500).json({ message: "Error saving recipe", error });
    }
};

// Remove a recipe from the saved collection
const removeFromSaveCollection = async (req, res) => {
    try {
        const userId = req.user._id;
        const { recipeId } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { savedRecipes: recipeId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Recipe removed from saved collection", savedRecipes: user.savedRecipes });
    } catch (error) {
        res.status(500).json({ message: "Error removing recipe", error });
    }
};

// Fetch all saved recipes for the user
const fetchSavedRecipeData = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).populate("savedRecipes");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ savedRecipes: user.savedRecipes });
    } catch (error) {
        res.status(500).json({ message: "Error fetching saved recipes", error });
    }
};

export { addToSaveCollection, removeFromSaveCollection, fetchSavedRecipeData };
