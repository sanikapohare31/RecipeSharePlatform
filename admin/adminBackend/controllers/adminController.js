// // import Admin from "../models/adminModel.js"; 
// // import jwt from "jsonwebtoken";
// // import bcrypt from "bcrypt";
// // import validator from "validator";
// // import Recipe from "../../../backend/models/recipeModel.js";

// // const createToken = (id,role) => {
// //     return jwt.sign({ id,role }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Set a token expiration time
// // };
// // // Login admin
// // const loginAdmin = async (req, res) => {
// //     const { email, password } = req.body;
// //     try {
// //         const admin = await Admin.findOne({ email });
// //         if (!admin) {
// //             return res.json({ success: false, message: "Admin does not exist!" });
// //         }

// //         const isMatch = await bcrypt.compare(password, admin.password);
// //         if (!isMatch) {
// //             return res.json({ success: false, message: "Invalid Credentials!" });
// //         }

// //         const token = createToken(admin._id,'admin');
// //         res.json({ success: true, token });
// //     } catch (error) {
// //         console.log(error);
// //         res.json({ success: false, message: "Error!" });
// //     }
// // };


// // // Register admin
// // const registerAdmin = async (req, res) => {
// //     const { name, email, password } = req.body;
// //     try {
// //         // Check if admin already exists
// //         const exists = await Admin.findOne({ email });
// //         if (exists) {
// //             return res.json({ success: false, message: "Admin Already Exists!" });
// //         }

// //         // Validate email
// //         if (!validator.isEmail(email)) {
// //             return res.json({ success: false, message: "Please enter a valid Email!" });
// //         }

// //         // Check password length
// //         if (password.length < 8) {
// //             return res.json({ success: false, message: "Please enter a strong password." });
// //         }

// //         // Hashing admin password
// //         const salt = await bcrypt.genSalt(10);
// //         const hashedPassword = await bcrypt.hash(password, salt);

// //         const newAdmin = new Admin({
// //             name: name,
// //             email: email,
// //             password: hashedPassword,
// //         });

// //         const admin = await newAdmin.save();
// //         const token = createToken(admin._id,'admin');
// //         res.json({ success: true, token });
// //     } catch (error) {
// //         console.log(error);
// //         res.json({ success: false, message: "Error" });
// //     }
// // };

// // const getPendingRecipes = async (req, res) => {
// //   try {
// //     console.log("Recipe model:", Recipe);
// //     if (!Recipe) {
// //       console.error("Recipe model is not accessible.");
// //       return res.status(500).json({ success: false, message: "Recipe model is not accessible." });
// //     }
    
// //     const pendingRecipes = await Recipe.find({ status: "pending" });

// //     if (!pendingRecipes || pendingRecipes.length === 0) {
// //       console.log("No pending recipes found.");
// //       return res.status(200).json({ success: true, recipes: [] });
// //     }

// //     console.log("Pending Recipes:", pendingRecipes);
// //     res.status(200).json({ success: true, recipes: pendingRecipes });
    
// //   } catch (error) {
// //     console.error("Error in getPendingRecipes:", error.message || error);
// //     res.status(500).json({ success: false, message: error.message || "Error fetching pending recipes" });
// //   }
// // };


// // // Approve a recipe
// // const approveRecipe = async (req, res) => {
// //   try {
// //     const recipeId = req.params.id;
// //     const updatedRecipe = await Recipe.findByIdAndUpdate(
// //       recipeId,
// //       { status: 'approved' },
// //       { new: true }
// //     );
// //     res.json({ message: 'Recipe approved successfully', recipe: updatedRecipe });
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };

// // // Reject a recipe
// // const rejectRecipe = async (req, res) => {
// //   try {
// //     const recipeId = req.params.id;
// //     await Recipe.findByIdAndDelete(recipeId);
// //     res.json({ message: 'Recipe rejected and deleted' });
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };

// // // Fetch admin details
// // const fetchAdminDetails = async (req, res) => {
// //     const adminId = req.params.adminId; // Assuming adminId is passed as a URL parameter
// //     try {
// //         const admin = await Admin.findById(adminId).select('-password'); // Fetch admin by ID and exclude the password
// //         if (!admin) {
// //             return res.status(404).json({ success: false, message: "Admin not found" });
// //         }
// //         res.json({ success: true, data: admin }); // Send the admin data in response
// //     } catch (error) {
// //         console.log(error);
// //         res.status(500).json({ success: false, message: "Error fetching admin details" });
// //     }
// // };

  
  
// // export { loginAdmin, registerAdmin, fetchAdminDetails,getPendingRecipes,approveRecipe,rejectRecipe, };
// import Admin from "../models/adminModel.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import validator from "validator";
// import Recipe from "../../../backend/models/recipeModel.js";

// const createToken = (id, role) => {
//     return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
// };

// // Middleware to connect to MongoDB
// const connectToMongoDB = async (req, res, next) => {
//     try {
//         if (mongoose.connection.readyState === 0) {
//             await mongoose.connect(process.env.MONGO_URI, {
//                 useNewUrlParser: true,
//                 useUnifiedTopology: true,
//             });
//             console.log('Connected to MongoDB');
//         }
//         next();
//     } catch (error) {
//         console.error('Error connecting to MongoDB:', error);
//         res.status(500).json({ success: false, message: 'Database connection error' });
//     }
// };

// // Login admin
// const loginAdmin = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const admin = await Admin.findOne({ email });
//         if (!admin) {
//             return res.json({ success: false, message: "Admin does not exist!" });
//         }
//         const isMatch = await bcrypt.compare(password, admin.password);
//         if (!isMatch) {
//             return res.json({ success: false, message: "Invalid Credentials!" });
//         }
//         const token = createToken(admin._id, 'admin');
//         res.json({ success: true, token });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error logging in!" });
//     }
// };

// // Register admin
// const registerAdmin = async (req, res) => {
//     const { name, email, password } = req.body;
//     try {
//         const exists = await Admin.findOne({ email });
//         if (exists) {
//             return res.json({ success: false, message: "Admin Already Exists!" });
//         }
//         if (!validator.isEmail(email)) {
//             return res.json({ success: false, message: "Please enter a valid Email!" });
//         }
//         if (password.length < 8) {
//             return res.json({ success: false, message: "Please enter a strong password." });
//         }
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);
//         const newAdmin = new Admin({
//             name,
//             email,
//             password: hashedPassword,
//         });
//         const admin = await newAdmin.save();
//         const token = createToken(admin._id, 'admin');
//         res.json({ success: true, token });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error registering admin" });
//     }
// };

// // Get pending recipes
// const getPendingRecipes = async (req, res) => {
//     try {
//         const pendingRecipes = await Recipe.find({ status: "pending" });
//         if (!pendingRecipes || pendingRecipes.length === 0) {
//             return res.status(200).json({ success: true, recipes: [] });
//         }
//         res.status(200).json({ success: true, recipes: pendingRecipes });
//     } catch (error) {
//         console.error("Error in getPendingRecipes:", error);
//         res.status(500).json({ success: false, message: "Error fetching pending recipes" });
//     }
// };

// // Approve a recipe
// const approveRecipe = async (req, res) => {
//     try {
//         const recipeId = req.params.id;
//         const updatedRecipe = await Recipe.findByIdAndUpdate(
//             recipeId,
//             { status: 'approved' },
//             { new: true }
//         );
//         res.json({ message: 'Recipe approved successfully', recipe: updatedRecipe });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Reject a recipe
// const rejectRecipe = async (req, res) => {
//     try {
//         const recipeId = req.params.id;
//         await Recipe.findByIdAndDelete(recipeId);
//         res.json({ message: 'Recipe rejected and deleted' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Fetch admin details
// const fetchAdminDetails = async (req, res) => {
//     const adminId = req.params.adminId;
//     try {
//         const admin = await Admin.findById(adminId).select('-password');
//         if (!admin) {
//             return res.status(404).json({ success: false, message: "Admin not found" });
//         }
//         res.json({ success: true, data: admin });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Error fetching admin details" });
//     }
// };

// export {
//     loginAdmin,
//     registerAdmin,
//     fetchAdminDetails,
//     getPendingRecipes,
//     approveRecipe,
//     rejectRecipe,
// };
