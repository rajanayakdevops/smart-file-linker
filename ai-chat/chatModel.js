const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    sessionId: { type: String, required: true }, // Unique session ID for each project
    userMessage: { type: String, required: true },
    aiResponse: { type: String, required: true },
    keywords: { type: [String], required: true }, // Array of words from the user's message
    timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;