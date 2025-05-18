const express = require("express");
const axios = require("axios");

const cors = require("cors");
require("dotenv").config();
require("./connection/connection");
const router = require("./routes/user");
const RR=require("./routes/chat")
const ChatHistory = require("./models/chathistory"); // Chat Model

const PORT = process.env.PORT || 5000;


// Middleware
const app = express();

app.use(express.json());
app.use(cors());
 // Routes
app.use(router);
app.use(RR);

// Test Route
app.get("/", (req, res) => {
    res.send("Hello pong");
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ message: "Something went wrong!", error: err.message });
});

const chatHistory = []; // Chat History को Store करने के लिए
// yaha 

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Load API key from .env
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyAYUPEk5kLsd0lVFKNJYtCHl5HLAQxjYiw");
console.log(GEMINI_API_KEY)
// app.post("/api/chat", async (req, res) => {
// console.log("dddddddddddddddddd",GEMINI_API_KEY,"dddddddddddddddddd",genAI);

//   const { userId, message } = req.body;
//   console.log("User ID:", userId);
//   console.log("User Message:", message);

//   if (!userId || !message) {
//       return res.status(400).json({ error: "User ID and message required hai." });
//   }

//   try {
//       let chat = await ChatHistory.findOne({ userId });

//       if (!chat) {
//           chat = new ChatHistory({ userId, messages: [] });
//       }

//       // User message ko store karo
//       chat.messages.push({ role: "user", content: message });

//       // 🔥 Gemini AI se response lo
//       const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//       const result = await model.generateContent(message);
// const botResponse = result.response.candidates[0].content.parts.map(part => part.text).join("");


//       // Bot response store karo
//       chat.messages.push({ role: "assistant", content: botResponse });

//       // Database update karo
//       await chat.save();

//       res.json({ response: botResponse });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.post("/api/chat", async (req, res) => {
  const { userId, message } = req.body;

  console.log("User ID:", userId);
  console.log("User Message:", message);

  if (!userId || !message) {
    return res.status(400).json({ error: "User ID and message required hai." });
  }

  try {
    // Find or create chat history for user
    let chat = await ChatHistory.findOne({ userId });
    if (!chat) {
      chat = new ChatHistory({ userId, messages: [] });
    }

    // Add user message to chat history
    chat.messages.push({ role: "user", content: message });

    // Ensure genAI and GEMINI_API_KEY are initialized
    if (!genAI || !GEMINI_API_KEY) {
      throw new Error("Gemini API not properly configured.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Generate content using Gemini
    const result = await model.generateContent(message);

    // Parse bot response safely
    const botResponse =
      result?.response?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text)
        .join("") || "No response from Gemini.";

    // Add bot response to chat history
    chat.messages.push({ role: "assistant", content: botResponse });

    // Save updated chat
    await chat.save();

    // Return bot response
    res.json({ response: botResponse });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
});
