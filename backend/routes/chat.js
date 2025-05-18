const express = require("express");
const router = express.Router();
const ChatHistory = require("../models/chathistory");



router.get("/api/history/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      const chat = await ChatHistory.findOne({ userId });
      if (!chat) {
        return res.json([]);
      }
      res.json(chat.messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

module.exports = router;
