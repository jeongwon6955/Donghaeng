const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Bearer <token>
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ success: false, message: "유효하지 않은 토큰입니다." });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ success: false, message: "인증 토큰이 필요합니다." });
  }
};

const optionalAuthenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
      next();
    });
  } else {
    next();
  }
};

module.exports = { authenticateJWT, optionalAuthenticateJWT };
