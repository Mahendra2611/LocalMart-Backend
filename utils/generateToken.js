import jwt from 'jsonwebtoken';

const generateToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

export default generateToken;
