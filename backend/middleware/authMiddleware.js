const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Token nikalo header se
      token = req.headers.authorization.split(" ")[1];

      // Verify karo
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // User ko req mein daalo (password ke bina)
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json({ message: "Token invalid hai, access nahi milega" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Token nahi hai, access nahi milega" });
  }
};

module.exports = { protect };