// import express from "express";
// import { loginAdmin, registerAdmin, fetchAdminDetails,getPendingRecipes,approveRecipe,rejectRecipe,} from "../controllers/adminController.js";
// import adminAuth from "../middleware/adminAuth.js";
// const adminRouter = express.Router();

// // Admin login route
// adminRouter.post("/login", loginAdmin);

// // Admin registration route
// adminRouter.post("/register", registerAdmin);

// // Get all pending recipes
// adminRouter.get('/pendingRecipes', adminAuth, getPendingRecipes);

// // Approve a recipe
// adminRouter.post('/approveRecipe/:id', adminAuth, approveRecipe);

// // Reject a recipe
// adminRouter.post('/rejectRecipe/:id', adminAuth, rejectRecipe);

// // Fetch admin details route
// adminRouter.get("/:adminId", fetchAdminDetails);

// export default adminRouter;
