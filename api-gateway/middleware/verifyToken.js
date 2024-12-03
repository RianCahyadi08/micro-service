const jwt = require("jsonwebtoken");
const {
  JWT_SECRET,
  JWT_SECRET_REFRESH_TOKEN,
  JWT_ACCESS_TOKEN_EXPIRED,
  JWT_REFRESH_TOKEN_EXPIRED,
} = process.env;

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).json({ status: "error", message: err.message });
    }

    req.user = decoded;
    return next();
  });
};
