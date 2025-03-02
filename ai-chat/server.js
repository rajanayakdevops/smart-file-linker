require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Chat = require("./chatModel");
const { getAIResponse } = require("./geminiService");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Fix API Route: Handle AI Chat
app.post("/api/chat", async (req, res) => {
    const { sessionId, userMessage } = req.body;

    if (!sessionId || !userMessage) {
        return res.status(400).json({ error: "Session ID and user message are required" });
    }

    // Get AI response
    const aiResponse = await getAIResponse(userMessage);

    // Store chat history in MongoDB
    const chatEntry = new Chat({ sessionId, userMessage, aiResponse });
    await chatEntry.save();

    res.json({ userMessage, aiResponse }); // ✅ Fix response format
});

// Start the Server
app.listen(PORT, () => console.log(`🚀 AI Chat Server running on http://localhost:${PORT}`));
