import Recipe from '../models/recipeModel.js';
import fs from 'fs';
import  {knn,euclideanDistance}  from '../services/knn.js';
import mongoose from 'mongoose';
//add recipe item
const addRecipe = async(req,res)=>{
    let image_filename=`${req.file.filename}`;
    const recipe = new Recipe({
        title: req.body.title,
        ingredients:req.body.ingredients,
        instructions: req.body.instructions,
        description:req.body.description,
        category:req.body.category,
        cuisine: req.body.cuisine,
        dietaryPreferences: req.body.dietaryPreferences,
        cookingTime: req.body.cookingTime,
        difficulty: req.body.difficulty,
        createdBy: req.body.createdBy, 
        image:image_filename
    })
    try{
        await recipe.save();
        res.json({success:true,message:"Recipe Added"})
    } catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}
//fectch recipe

// all recipe list
const listRecipe = async(req,res)=>{
    try{
        const recipes= await Recipe.find();
        res.json({success:true,data:recipes});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"error"})
    }
}
//List recipes created by a specific user
const listUserRecipes = async (req, res) => {
    const userId = req.params.userId; // Assuming userId is passed as a URL parameter
    try {
        const recipes = await Recipe.find({ createdBy: userId });
        res.json({ success: true, data: recipes });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching user recipes" });
    }
};

//remove recipe item
const removeRecipe = async(req,res)=>{
    try{
        const recipe = await Recipe.findById(req.body.id);
        fs.unlink(`uploads/${recipe.image}`,()=>{})
        await Recipe.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Recipe Removed"})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const filterRecipes = async (req, res) => {
    try {
        console.log("Received query parameters:", req.query);

        // Extract query parameters
        const { cuisine, dietary, cookingTime, difficulty } = req.query;

        // Build filter object based on query parameters
        const filter = {};

        if (cuisine) {
            filter.cuisine = { $in: cuisine.split(',') };
        }

        if (dietary) {
            filter.dietaryPreferences = { $in: dietary.split(',') };
        }

        if (cookingTime) {
            const timeRanges = cookingTime.split(',').map(range => range.split('-').map(Number));

            const orConditions = timeRanges.map(([min, max]) => {
                if (max === undefined) {
                    // Handle 'over' case, e.g., cookingTime='60-Infinity'
                    return { cookingTime: { $gte: min } };
                } else {
                    // Handle 'range' case, e.g., cookingTime='30-60'
                    return { cookingTime: { $gte: min, $lte: max } };
                }
            });

            filter.$or = orConditions; // Set $or condition for the query
        }

        if (difficulty) {
            filter.difficulty = { $in: difficulty.split(',') };
        }

        console.log("Constructed filter:", filter);

        const recipes = await Recipe.find(filter);

        res.status(200).json({
            success: true,
            data: recipes,
        });
    } catch (error) {
        console.error("Error fetching filtered recipes:", error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

function transformRecipeData(recipes) {
    if (!Array.isArray(recipes)) {
        throw new Error("Expected an array of recipes");
    }

    const allIngredients = [...new Set(recipes.flatMap(recipe => recipe.ingredients))];
    const cuisines = [...new Set(recipes.map(recipe => recipe.cuisine))];
    const dietaryPreferences = [...new Set(recipes.flatMap(recipe => recipe.dietaryPreferences))];

    // Ensure consistent length for ingredient vectors
    const maxIngredientLength = allIngredients.length;
    const maxCuisineLength = cuisines.length;
    const maxDietaryLength = dietaryPreferences.length;

    return recipes.map(recipe => {
        // Generate feature vectors
        const ingredientVector = new Array(maxIngredientLength).fill(0);
        allIngredients.forEach((ingredient, index) => {
            ingredientVector[index] = recipe.ingredients.includes(ingredient) ? 1 : 0;
        });

        const cuisineVector = new Array(maxCuisineLength).fill(0);
        cuisines.forEach((cuisine, index) => {
            cuisineVector[index] = recipe.cuisine === cuisine ? 1 : 0;
        });

        const dietaryVector = new Array(maxDietaryLength).fill(0);
        dietaryPreferences.forEach((preference, index) => {
            dietaryVector[index] = recipe.dietaryPreferences.includes(preference) ? 1 : 0;
        });

        const cookingTime = recipe.cookingTime || 0; // Default to 0 if not defined
        const difficulty = recipe.difficulty ? (recipe.difficulty === 'easy' ? 1 : recipe.difficulty === 'hard' ? 2 : 0) : 0; 

        return {
            features: [
                ...ingredientVector,
                ...cuisineVector,
                cookingTime,
                difficulty,
                ...dietaryVector
            ],
            label: recipe._id.toString() // Ensure this is a string representation of ObjectId
        };
    });
}

//fetch recipe
const fetchRecipe = async (req, res) => {
    const recipeId = req.params.id; // Assuming recipeId is passed as a URL parameter
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
        return res.status(400).json({ success: false, message: "Invalid recipe ID format." });
      }
    try {
        const recipe = await Recipe.findById(recipeId).populate('createdBy');
        if (!recipe) {
            return res.status(404).json({ success: false, message: "Recipe not found" });
        }
        res.json({ success: true, data: recipe });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching recipe" });
    }
};
function transformNewRecipeData(newRecipe, allIngredients, cuisines, dietaryPreferences) {
    if (!newRecipe) {
        throw new Error("New recipe must be provided");
    }

    const ingredientVector = allIngredients.map(ingredient => newRecipe.ingredients.includes(ingredient) ? 1 : 0);
    const cuisineVector = cuisines.map(cuisine => newRecipe.cuisine === cuisine ? 1 : 0);
    const dietaryVector = dietaryPreferences.map(preference => newRecipe.dietaryPreferences.includes(preference) ? 1 : 0);
    
    const cookingTime = newRecipe.cookingTime || 0;
    const difficulty = newRecipe.difficulty ? (newRecipe.difficulty === 'easy' ? 1 : newRecipe.difficulty === 'hard' ? 2 : 0) : 0;

    const features = [
        ...ingredientVector,
        ...cuisineVector,
        cookingTime,
        difficulty,
        ...dietaryVector
    ];

    return {
        features,
        label: newRecipe._id.toString()
    };
}

// Get recipe recommendations
const getRecommendations = async (req, res) => {
    try {
        // Fetch all recipes (you can filter as needed)
        const{id}= req.params;
        const recipe=await Recipe.findById(id);
        console.log(`Fetching recommendations for ID: ${req.params.id}`);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        const recipes = await Recipe.find({ _id: { $ne: id } });
        // Ensure there are recipes to process
        if (!recipes.length) {
            return res.json({ message: 'No available recipes for recommendations.' });
        }

        // Transform the recipe data
        const transformedRecipes = transformRecipeData(recipes);
        const allIngredients = [...new Set(recipes.flatMap(recipe => recipe.ingredients))];
        const cuisines = [...new Set(recipes.map(recipe => recipe.cuisine))];
        const dietaryPreferences = [...new Set(recipes.flatMap(recipe => recipe.dietaryPreferences))];

        // Transform the new recipe
        const newRecipeTransformed = transformNewRecipeData(recipe, allIngredients, cuisines, dietaryPreferences);
        // Transform the new recipe data
        
        console.log(newRecipeTransformed);
        // Get recommendations using KNN (assuming k=3)
        const recommendations = knn(transformedRecipes, newRecipeTransformed, 3); // k=3
        console.log(recommendations);
        // Ensure the labels returned from KNN are valid ObjectIds
        const recommendedRecipeIds = recommendations.map(rec => {
            const label = rec;

            // Check if label is a valid ObjectId string
            if (label  && mongoose.Types.ObjectId.isValid(label)) {
                return new mongoose.Types.ObjectId(label);
            }else {
                console.error(`Invalid ObjectId: ${label}`);
                return null; // Ignore invalid IDs
            }
        }).filter(id => id !== null);
        // Filter out invalid ObjectIds
        console.log(recommendedRecipeIds);
        
        const recommendedRecipes = await Recipe.find({ _id: { $in: recommendedRecipeIds } });
        const recipeMap = {};
        recommendedRecipes.forEach(recipe => {
            recipeMap[recipe._id] = recipe; // Map each recipe ID to its recipe object
        });

        // Sort the fetched recipes based on the original recommendedRecipeIds order
        const sortedRecommendedRecipes = recommendedRecipeIds.map(id => recipeMap[id]);

        // Return the sorted recommended recipes
        res.json(sortedRecommendedRecipes);
        console.log(sortedRecommendedRecipes);
        // Return the recommended recipes
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

export {addRecipe,listRecipe,removeRecipe,listUserRecipes,fetchRecipe,filterRecipes,getRecommendations}