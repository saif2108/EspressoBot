(function() {
    // Your Gemini API Key - Replace with your actual API key
    const GEMINI_API_KEY = 'AIzaSyC_PMqPVPNO6iXfkM0Tkyzd7QveCJNzOqQ';
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

    // Create widget styles
    const styles = `
        .gemini-chatbot-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .gemini-chat-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4285f4 0%, #34a853 50%, #fbbc05 75%, #ea4335 100%);
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }

        .gemini-chat-icon:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }

        .gemini-chat-window {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            display: none;
            flex-direction: column;
            overflow: hidden;
        }

        .gemini-chat-header {
            background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
            color: white;
            padding: 16px;
            text-align: center;
            font-weight: 600;
            position: relative;
        }

        .gemini-chat-close {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s;
        }

        .gemini-chat-close:hover {
            background-color: rgba(255,255,255,0.2);
        }

        .gemini-chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .gemini-message {
            max-width: 80%;
            padding: 8px 12px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
        }

        .gemini-message.user {
            background: #4285f4;
            color: white;
            align-self: flex-end;
            margin-left: auto;
        }

        .gemini-message.bot {
            background: #f1f3f4;
            color: #333;
            align-self: flex-start;
        }

        .gemini-chat-input-container {
            padding: 16px;
            border-top: 1px solid #e0e0e0;
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .gemini-chat-input {
            flex: 1;
            padding: 10px 16px;
            border: 1px solid #e0e0e0;
            border-radius: 20px;
            outline: none;
            font-size: 14px;
            resize: none;
            font-family: inherit;
        }

        .gemini-chat-input:focus {
            border-color: #4285f4;
        }

        .gemini-send-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #4285f4;
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: background-color 0.2s;
        }

        .gemini-send-btn:hover {
            background: #3367d6;
        }

        .gemini-send-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .gemini-typing {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 8px 12px;
            background: #f1f3f4;
            border-radius: 18px;
            align-self: flex-start;
            max-width: 80%;
        }

        .gemini-typing-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #666;
            animation: gemini-typing 1.4s infinite ease-in-out;
        }

        .gemini-typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .gemini-typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes gemini-typing {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
        }

        @media (max-width: 480px) {
            .gemini-chat-window {
                width: calc(100vw - 40px);
                height: calc(100vh - 120px);
                bottom: 80px;
                right: 20px;
            }
        }
    `;

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Create widget HTML
    const widgetHTML = `
        <div class="gemini-chatbot-widget">
            <button class="gemini-chat-icon" id="gemini-chat-toggle">
                💬
            </button>
            <div class="gemini-chat-window" id="gemini-chat-window">
                <div class="gemini-chat-header">
                    EspressoBot Assistant
                    <button class="gemini-chat-close" id="gemini-chat-close">×</button>
                </div>
                <div class="gemini-chat-messages" id="gemini-chat-messages">
                    <div class="gemini-message bot">
                        Hi! I'm your AI assistant powered by Gemini. How can I help you today?
                    </div>
                </div>
                <div class="gemini-chat-input-container">
                    <input type="text" class="gemini-chat-input" id="gemini-chat-input" placeholder="Type your message...">
                    <button class="gemini-send-btn" id="gemini-send-btn">➤</button>
                </div>
            </div>
        </div>
    `;

    // Insert widget into page
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // Get elements
    const chatIcon = document.getElementById('gemini-chat-toggle');
    const chatWindow = document.getElementById('gemini-chat-window');
    const chatClose = document.getElementById('gemini-chat-close');
    const chatMessages = document.getElementById('gemini-chat-messages');
    const chatInput = document.getElementById('gemini-chat-input');
    const sendBtn = document.getElementById('gemini-send-btn');

    let isOpen = false;

    // Toggle chat window
    function toggleChat() {
        isOpen = !isOpen;
        chatWindow.style.display = isOpen ? 'flex' : 'none';
        if (isOpen) {
            chatInput.focus();
        }
    }

    // Add message to chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `gemini-message ${isUser ? 'user' : 'bot'}`;
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show typing indicator
    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'gemini-typing';
        typingDiv.id = 'gemini-typing-indicator';
        typingDiv.innerHTML = '<div class="gemini-typing-dot"></div><div class="gemini-typing-dot"></div><div class="gemini-typing-dot"></div>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Hide typing indicator
    function hideTyping() {
        const typingIndicator = document.getElementById('gemini-typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Send message to Gemini API
    async function sendToGemini(message) {
        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            return "Please configure your Gemini API key in the script.";
        }

        try {
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: message
                        }]
                    }]
                })
            });

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                return "Sorry, I couldn't process your request. Please try again.";
            }
        } catch (error) {
            console.error('Gemini API Error:', error);
            return "Sorry, I'm having trouble connecting. Please try again later.";
        }
    }

    // Handle message sending
    async function handleSendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, true);
        chatInput.value = '';
        sendBtn.disabled = true;

        // Show typing indicator
        showTyping();

        // Send to Gemini and get response
        const response = await sendToGemini(message);
        
        // Hide typing indicator and show response
        hideTyping();
        addMessage(response);
        sendBtn.disabled = false;
        chatInput.focus();
    }

    // Event listeners
    chatIcon.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);
    sendBtn.addEventListener('click', handleSendMessage);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
        if (isOpen && !chatWindow.contains(e.target) && !chatIcon.contains(e.target)) {
            toggleChat();
        }
    });

})();