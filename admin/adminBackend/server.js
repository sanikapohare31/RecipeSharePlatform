import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bcrypt from 'bcrypt';
import validator from 'validator';
import Admin from './models/adminModel.js'; 
import Recipe from '../../backend/models/recipeModel.js'; 

const app = express();
const PORT = 4000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Call MongoDB connection on server start
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/recipe-share', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Connected")
        
    } catch (err) {
        console.error("DB Connection Error:", err);
        process.exit(1); // Exit the process with a failure
    }
};

// JWT Token Creation
const createToken = (id, role) => {
    return jwt.sign({ id, role }, 'random#secret', { expiresIn: '1h' }); // Hard-coded secret
};

// Middleware for admin authentication
const adminAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }
    jwt.verify(token, 'random#secret', (err, decoded) => { // Hard-coded secret
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid token' });
        }
        req.user = decoded;
        console.log(req.user); // Attach user info to request
        next();
    });
};

// Route Handlers

// Admin login
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.json({ success: false, message: "Admin does not exist!" });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials!" });
        }
        const token = createToken(admin._id, 'admin');
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error logging in!" });
    }
};

// Admin registration
const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exists = await Admin.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Admin Already Exists!" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid Email!" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password." });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
        });
        await newAdmin.save();
        const token = createToken(newAdmin._id, 'admin');
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error registering admin" });
    }
};

// Get pending recipes
// const getPendingRecipes = async (req, res) => {
//     try {
//         console.log('Hi');
//         const pendingRecipes = await Recipe.find({status:'pending'});
//         console.log(pendingRecipes);
//         if (!pendingRecipes || pendingRecipes.length === 0) {
//             return res.status(200).json({ success: true, recipes: [] });
//         }
//         res.status(200).json({ success: true, recipes: pendingRecipes });
//     } catch (error) {
//         console.error("Error in getPendingRecipes:", error);
//         res.status(500).json({ success: false, message: "Error fetching pending recipes" });
//     }
// };
const getPendingRecipes = async (req, res) => {
    try {
        // Aggregate to count the number of pending recipes
        console.log('Hi');
        const pendingRecipesCountResult = await Recipe.aggregate([
            {
                $match: {
                    status: 'pending' // Match recipes with status 'pending'
                }
            },
            {
                $count: 'pendingCount' // Count the number of matched recipes
            }
        ]);
        console.log('Hi');
        // Check if there are any pending recipes
        if (!pendingRecipesCountResult || pendingRecipesCountResult.length === 0) {
            // If no pending recipes, return a count of 0
            return res.status(200).json({
                status: 200,
                data: { pendingCount: 0 },
                message: "No pending recipes found"
            });
        }

        // Extract the count from the aggregation result
        const pendingCount = pendingRecipesCountResult[0].pendingCount;

        // Return the count as part of the response
        return res.status(200).json({
            status: 200,
            data: { pendingCount },
            message: "Pending recipes count fetched successfully"
        });
    } catch (error) {
        // Handle any errors
        return res.status(500).json({
            status: 500,
            message: "Error fetching pending recipes",
            error: error.message
        });
    }
};



// Approve a recipe
const approveRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            recipeId,
            { status: 'approved' },
            { new: true }
        );
        res.json({ message: 'Recipe approved successfully', recipe: updatedRecipe });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reject a recipe
const rejectRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        await Recipe.findByIdAndDelete(recipeId);
        res.json({ message: 'Recipe rejected and deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch admin details
const fetchAdminDetails = async (req, res) => {
    const adminId = req.params.id;
    try {
        const admin = await Admin.findById(adminId).select('-password');
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        res.json({ success: true, data: admin });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching admin details" });
    }
};

// Start Server after DB Connection
connectDB().then(() => {
    // Define Routes
    app.post("/api/admin/login", loginAdmin);
    app.post("/api/admin/register", registerAdmin);
    app.get('/api/admin/pendingRecipes', adminAuth, getPendingRecipes);
    app.post('/api/admin/approveRecipe/:id', adminAuth, approveRecipe);
    app.post('/api/admin/rejectRecipe/:id', adminAuth, rejectRecipe);
    app.get("/api/admin/:id", fetchAdminDetails);

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => console.error("Failed to connect to the database:", err));
