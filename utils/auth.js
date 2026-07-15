const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "wanderly-dev-secret-change-me";
const AUTH_COOKIE = "wanderly_token";

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = { signToken, verifyToken, JWT_SECRET, AUTH_COOKIE };
