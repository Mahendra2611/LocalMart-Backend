import jwt from "jsonwebtoken";

export const authenticateCustomer = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.customerId =  decoded.id ;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authenticateOwner = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "owner") return res.status(403).json({ message: "Access denied" });

    req.ownerId =  decoded.id ;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
