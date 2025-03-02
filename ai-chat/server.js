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

// Helper function to calculate match percentage
function calculateMatchPercentage(newKeywords, storedKeywords) {
    const commonWords = newKeywords.filter(word => storedKeywords.includes(word));
    return (commonWords.length / storedKeywords.length) * 100;
}

// ✅ Fix API Route: Handle AI Chat
app.post("/api/chat", async (req, res) => {
    const { sessionId, userMessage } = req.body;

    if (!sessionId || !userMessage) {
        return res.status(400).json({ error: "Session ID and user message are required" });
    }

    // Break down the user's message into keywords
    const newKeywords = userMessage.toLowerCase().split(" ");

    // Retrieve chat history for the session
    const storedChats = await Chat.find({ sessionId });

    // Check for a matching question in the chat history
    let matchedQuestion = null;
    let matchedResponse = null;
    const threshold = 50; // Match percentage threshold set to 50%

    for (const chat of storedChats) {
        const matchPercentage = calculateMatchPercentage(newKeywords, chat.keywords);
        if (matchPercentage >= threshold) {
            matchedQuestion = chat.userMessage;
            matchedResponse = chat.aiResponse;
            break;
        }
    }

    // Prepare the context for the API
    const context = matchedResponse
        ? `Previous question: ${matchedQuestion}\nPrevious answer: ${matchedResponse}\nNew question: ${userMessage}\nPlease provide a response based on the previous data and the new question.`
        : `New question: ${userMessage}\nPlease provide a response.`;

    // Get AI response
    const aiResponse = await getAIResponse(context);

    // Store chat history in MongoDB
    const chatEntry = new Chat({ sessionId, userMessage, aiResponse, keywords: newKeywords });
    await chatEntry.save();

    res.json({ userMessage, aiResponse }); // ✅ Fix response format
});

// Start the Server
app.listen(PORT, () => console.log(`🚀 AI Chat Server running on http://localhost:${PORT}`));

