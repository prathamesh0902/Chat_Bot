let currentQuestionIndex = 0;
const questions = [
    "What is the make of your car?",
    // "What is the model of your car?",
    // "What year was your car manufactured?",
    // "What is your car's mileage?"
];

const chatOutput = document.getElementById("chat-output");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", handleUserInput);

// Start the chat with the initial message
addMessageToChat("Bot", "Welcome! Would you like to get a car insurance quote? (Type 'yes' to proceed)");

function handleUserInput() {
    const userResponse = userInput.value;
    if (!userResponse) return;

    addMessageToChat("You", userResponse);
    userInput.value = '';
    console.log("Questions length: ", questions.length);

    if (currentQuestionIndex === 0) {
        // If the user wants a quote, proceed with the questions
        console.log("Starting quote process"); 
        if (userResponse.toLowerCase() === "yes") {
            setTimeout(() => {
                addMessageToChat("Bot", questions[currentQuestionIndex]);
                currentQuestionIndex++;
            }, 500);
        } else {
            addMessageToChat("Bot", "Okay, let me know if you need anything else.");
        }
    } else if (currentQuestionIndex > 0 && currentQuestionIndex <= questions.length) {
        // Ask next question until we collect all car details
        console.log("question index before: ", currentQuestionIndex);
        // setTimeout(() => {
        //     addMessageToChat("Bot", questions[currentQuestionIndex]);
        //     currentQuestionIndex++;
        // }, 500);
        if (currentQuestionIndex < questions.length)
            addMessageToChat("Bot", questions[currentQuestionIndex]);
        currentQuestionIndex++;
        console.log("question index after: ", currentQuestionIndex);

        if (currentQuestionIndex === questions.length + 1) {
            // Send data to backend and get quote
            console.log("Getting quote...");
            getQuote();
            console.log("Asking for email");
            setTimeout(() => {
                addMessageToChat("Bot", "Would you like to receive the quote via email? Please provide your email address.");
            }, 500);
            console.log("Question index after getting email: ", currentQuestionIndex);
        }
        
    } else if (currentQuestionIndex === questions.length + 20) {
        // Ask for email
        console.log("Asking for email");
        setTimeout(() => {
            addMessageToChat("Bot", "Would you like to receive the quote via email? Please provide your email address.");
        }, 1000);
        currentQuestionIndex++;
    } else if (currentQuestionIndex === questions.length + 2) {
        // Send email
        sendEmail(userResponse);
    }
}

function addMessageToChat(sender, message) {
    console.log(`${sender}: ${message}`);
    const messageElement = document.createElement("div");
    messageElement.textContent = `${sender}: ${message}`;
    chatOutput.appendChild(messageElement);
}

function getQuote() {
    console.log("Fetching quote...");
    fetch('/get_quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            make: 'Toyota', // Example data
            model: 'Camry', 
            year: '2018', 
            mileage: '20000' 
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Quote data: ", data); 
        if (data && data.quote) {
            addMessageToChat("Bot", `The predicted premium for your car is: $${data.quote}`);
        } else {
            addMessageToChat("Bot", "Sorry, we couldn't calculate the premium at this moment.");
        }
        currentQuestionIndex++;
        console.log("Question index after getting quote: ", currentQuestionIndex);
        handleUserInput(); // Trigger email request
    });
}

function sendEmail(response) {
    // Function to validate email format
    function isValidEmail(email) {
        // Basic regex for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Check if the response contains "NO" (case insensitive)
    if (response.toLowerCase().includes("no")) {
        addMessageToChat("Bot", "You chose not to receive the email. Thanks!");
        return; // Stop the process
    }

    // If response is not "NO", treat it as an email and check the format
    if (!isValidEmail(response)) {
        addMessageToChat("Bot", "The email format seems incorrect. Please provide a valid email address.");
        return; // Stop further execution
    }

    // Proceed to send email
    fetch('/send_email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: response })
    })
    .then(response => response.json())
    .then(data => {
        // Check if the email was successfully sent
        addMessageToChat("Bot", "Email sent successfully!");
    })
    .catch(error => {
        // Handle any errors during fetch
        console.error('Error sending email:', error);
        addMessageToChat("Bot", "There was an error sending the email. Please try again later.");
    });
}

// Wait until the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {

    // Get references to the input field and the button
    const inputField = document.getElementById('user-input');
    const submitButton = document.getElementById('send-btn');

    // Add a keydown event listener to the input field
    inputField.addEventListener('keydown', function(event) {
        // Check if the pressed key is 'Enter'
        if (event.key === 'Enter') {
            // Prevent the default action (e.g., form submission)
            event.preventDefault();

            // Trigger the button click event
            submitButton.click();
        }
    });

    // // Add a click event listener to the button
    // submitButton.addEventListener('click', function() {
    //     alert('Button clicked: ' + inputField.value);
    // });

});
