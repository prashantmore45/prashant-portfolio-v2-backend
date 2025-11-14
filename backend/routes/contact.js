const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const DATA_PATH = path.join(__dirname, "../data/messages.json");

function readMessages() {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function writeMessages(arr) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(arr, null, 2));
}

router.post("/", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.json({ success: false, msg: "All fields are required." });
  }

  const messages = readMessages();

  const newMessage = {
    id: Date.now(),
    name,
    email,
    message,
    date: new Date().toISOString()
  };

  messages.unshift(newMessage);
  writeMessages(messages);

  res.json({ success: true, msg: "Message sent successfully!" });
});

module.exports = router;
