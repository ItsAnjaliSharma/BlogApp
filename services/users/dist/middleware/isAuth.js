import Jwt from "jsonwebtoken";
export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Please Login - No token provided",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = Jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.user) {
            res.status(401).json({
                message: "Invalid token",
            });
            return;
        }
        req.user = decoded.user; // Attach the user to the request object
        next(); // Call the next middleware or route handler
    }
    catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(401).json({
            message: "Please Login -JWT verification failed",
        });
    }
};
