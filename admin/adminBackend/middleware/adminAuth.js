import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js"; // Ensure you import your Admin model
import dotenv from "dotenv";
dotenv.config();

const adminAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Not Authorized. Admin Login Required!" });
    }

    const token = authHeader.split(" ")[1]; // Extract token

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if the decoded token ID corresponds to an existing admin
        const admin = await Admin.findById(decodedToken.id);
        if (!admin) {
            return res.status(403).json({ success: false, message: "Admin not found" });
        }

        req.admin = admin; // Attach admin information to req.admin
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error(error);
        res.status(403).json({ success: false, message: "Invalid token" });
    }
};

export default adminAuth;
