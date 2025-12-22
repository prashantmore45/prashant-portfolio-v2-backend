const Contact = require("../models/Contact");

const express = require("express");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const router = express.Router();

const MESSAGES_PATH = path.join(__dirname, "../data/messages.json");
const PROJECTS_PATH = path.join(__dirname, "../data/projects.json");
const VISITORS_PATH = path.join(__dirname, "../data/visitors.json");

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;
const JWT_SECRET = process.env.JWT_SECRET;

if (!ADMIN_USER || !ADMIN_PASS || !JWT_SECRET) {
  throw new Error("Admin environment variables are not set");
}


// helper to read json
function readJson(filePath, fallback = []) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return fallback;
  }
}

// helper to write json
function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// --------------------
// LOGIN
// POST /admin-api/login
// body: { username, password }
// returns: { token }
// --------------------
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ ok: false, msg: "Missing credentials" });

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ user: username }, JWT_SECRET, { expiresIn: "8h" });
    return res.json({ ok: true, token });
  }

  return res.status(401).json({ ok: false, msg: "Invalid credentials" });
});

// --------------------
// Auth middleware
// check Authorization: Bearer <token>
// --------------------
function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ ok: false, msg: "No token" });

  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return res.status(401).json({ ok: false });

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ ok: false, msg: "Invalid token" });
  }
}

// --------------------
// GET messages
// GET /admin-api/messages
// --------------------
router.get("/messages", adminAuth, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error("Fetch messages error:", err);
    res.status(500).json({ ok: false, msg: "Server error" });
  }
});


// --------------------
// DELETE message
// DELETE /admin-api/messages/:id
// --------------------
router.delete("/messages/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (err) {
    console.error("Delete message error:", err);
    res.status(500).json({ ok: false, msg: "Server error" });
  }
});


// --------------------
// GET visitors count
// GET /admin-api/visitors
// --------------------
router.get("/visitors", adminAuth, (req, res) => {
  const v = readJson(VISITORS_PATH, { total: 0 });
  res.json(v);
});

// --------------------
// GET projects
// GET /admin-api/projects
// --------------------
router.get("/projects", adminAuth, (req, res) => {
  const projects = readJson(PROJECTS_PATH, []);
  res.json(projects);
});

// --------------------
// Export messages as CSV
// GET /admin-api/export
// --------------------
router.get("/export", adminAuth, (req, res) => {
  const messages = readJson(MESSAGES_PATH, []);
  // convert to CSV
  const headers = ["id","name","email","message","date"];
  const rows = messages.map(m => [
    String(m.id || ""),
    `"${(m.name || "").replace(/"/g,'""')}"`,
    `"${(m.email || "").replace(/"/g,'""')}"`,
    `"${(m.message || "").replace(/"/g,'""')}"`,
    m.date || ""
  ].join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="messages.csv"`);
  res.send(csv);
});

module.exports = router;
