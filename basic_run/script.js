// script.js
alert('JavaScript is working!');
document.addEventListener('DOMContentLoaded', function() {
    const chatOutput = document.getElementById('chat-output');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    sendBtn.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const userText = userInput.value.trim();
        if (userText === '') return;

        // Add user's message to the chat
        appendMessage('user', userText);

        // Clear the input field
        userInput.value = '';

        // Generate a bot response
        const botResponse = getBotResponse(userText);

        // Add bot's message to the chat
        setTimeout(() => {
            appendMessage('bot', botResponse);
        }, 500);
    }

    function appendMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        messageElement.textContent = text;
        chatOutput.appendChild(messageElement);

        // Scroll to the bottom of the chat
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }

    function getBotResponse(userText) {
        // Simple static responses for demonstration
        const responses = {
            "hello": "Hi there! How can I help you today?",
            "how are you": "I'm just a bot, but I'm doing great! How about you?",
            "what is your name": "I am your friendly chatbot. How can I assist you?",
            "bye": "Goodbye! Have a great day!"
        };

        return responses[userText.toLowerCase()] || "Sorry, I didn't understand that. Can you please rephrase?";
    }
});
