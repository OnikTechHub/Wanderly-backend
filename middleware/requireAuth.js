const { verifyToken, AUTH_COOKIE } = require("../utils/auth");

function requireAuth(req, res, next) {
  const token = req.cookies[AUTH_COOKIE];
  if (!token) {
    return res.status(401).json({ error: "You must be logged in." });
  }
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Session expired. Please log in again." });
  }
  req.user = payload;
  next();
}

module.exports = { requireAuth };
