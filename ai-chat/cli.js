const readline = require("readline");
const axios = require("axios");
require("dotenv").config();

const API_URL = `http://localhost:${process.env.PORT}/api/chat`; // 🔥 Fixed API URL

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("\n💬 AI Chat System Initialized! Type 'exit' to quit.\n");

function askQuestion() {
    rl.question("You: ", async (userInput) => {
        if (userInput.toLowerCase() === "exit") {
            console.log("👋 Exiting chat. Goodbye!");
            rl.close();
            return;
        }

        try {
            const response = await axios.post(API_URL, { 
                sessionId: "user-123",  // ✅ Added sessionId to match the API
                userMessage: userInput 
            });

            console.log("AI:", response.data.aiResponse); // ✅ Fixed response format
        } catch (error) {
            console.error("❌ Error communicating with AI chat server:", error.response?.data || error.message);
        }

        askQuestion(); // Continue the chat loop
    });
}

askQuestion();