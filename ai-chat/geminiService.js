require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;

/**
 * Sends a user message to the Gemini API and returns the AI-generated response.
 * @param {string} userMessage - The user's input message.
 * @returns {Promise<string>} - The AI's response.
 */
async function getAIResponse(userMessage) {
    try {
        const response = await axios.post(`${GEMINI_API_URL}?key=${API_KEY}`, {
            contents: [{ parts: [{ text: userMessage }] }] // ✅ Correct payload format
        });

        // ✅ Extract AI response correctly
        return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
    } catch (error) {
        console.error("❌ Gemini API Error:", error.response?.data || error.message);
        return "Error: Unable to fetch AI response.";
    }
}

module.exports = { getAIResponse };
