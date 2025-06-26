const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./connection/connection");

const router = require("./routes/user");
const chatRoutes = require("./routes/chat");
const ChatHistory = require("./models/chathistory");

const OpenAI = require("openai");

// 🔐 Use .env API key here
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://a-ichatbot-three.vercel.app/",
    "X-Title": "Yash-AI-Chatbot",
  },
});


const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use(router);
app.use(chatRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Hello pong");
});

// Chat Route
app.post("/api/chat", async (req, res) => {
  const { userId, message } = req.body;

  console.log("User ID:", userId);
  console.log("User Message:", message);

  if (!userId || !message) {
    return res.status(400).json({ error: "User ID and message required hai." });
  }

  try {
    let chat = await ChatHistory.findOne({ userId });
    if (!chat) {
      chat = new ChatHistory({ userId, messages: [] });
    }

    chat.messages.push({ role: "user", content: message });

   const history = chat.messages.slice(-10); // Only last 10 messages

const completion = await openai.chat.completions.create({
  model: "openai/gpt-4o",
  messages: history,
  max_tokens: 1000,
});


    const botMessage = completion?.choices?.[0]?.message?.content || "No response from AI.";
    chat.messages.push({ role: "assistant", content: botMessage });

    await chat.save();

    res.json({ response: botMessage });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running successfully on port ${PORT}`);
});
