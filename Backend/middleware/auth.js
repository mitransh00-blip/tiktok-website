const jwt = require("jsonwebtoken");

// Use the same JWT_SECRET as in authRoutes.js
const JWT_SECRET = process.env.JWT_SECRET || "mitransh_secret_key_2024";

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = auth;
