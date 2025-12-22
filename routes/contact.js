const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required.",
      });
    }

    await Contact.create({
      name,
      email,
      message,
    });

    res.json({
      success: true,
      msg: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
});

module.exports = router;
