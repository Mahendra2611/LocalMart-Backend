import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies['accessToken'];
  console.log("15")
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET_KEY);
        req.user = decoded;
     
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
};
