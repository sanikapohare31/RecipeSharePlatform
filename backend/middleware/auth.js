 import jwt from "jsonwebtoken";
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again!" });
    }

    const token = authHeader.split(" ")[1]; // Extract token

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { _id: decodedToken.id }; // Attach user ID to req.user
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: "Error in token verification" });
    }
};
export default authMiddleware;
