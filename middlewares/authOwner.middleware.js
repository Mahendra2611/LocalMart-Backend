import jwt from 'jsonwebtoken';

const verifyOwner = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: 'Unauthorized, No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.id = decoded.id; // Only store ID to avoid DB queries

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized, Invalid token' });
  }
};

export default verifyOwner;
