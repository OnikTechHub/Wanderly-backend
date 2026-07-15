const express = require("express");
const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");
const { getUserByEmail, addUser } = require("../utils/db");
const { signToken, verifyToken, AUTH_COOKIE } = require("../utils/auth");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.post("/register", (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }
    if (getUserByEmail(email)) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const user = addUser({
      id: `u-${uuid()}`,
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    });

    const token = signToken({ userId: user.id, email: user.email, name: user.name });
    res.cookie(AUTH_COOKIE, token, COOKIE_OPTS);
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = getUserByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = signToken({ userId: user.id, email: user.email, name: user.name });
    res.cookie(AUTH_COOKIE, token, COOKIE_OPTS);
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie(AUTH_COOKIE, { path: "/" });
  res.json({ ok: true });
});

router.get("/me", (req, res) => {
  const token = req.cookies[AUTH_COOKIE];
  const user = token ? verifyToken(token) : null;
  res.json({ user });
});

module.exports = router;
