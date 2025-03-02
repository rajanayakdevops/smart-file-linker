const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    sessionId: { type: String, required: true }, // Unique session ID for each project
    userMessage: { type: String, required: true },
    aiResponse: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
