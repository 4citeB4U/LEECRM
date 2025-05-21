/**
 * Agent Lee Card System
 * Provides a floating assistant card that can be used throughout the CRM
 */

// Track initialization state
let isAgentLeeCardInitialized = false;

// Initialize the Agent Lee Card system
function initializeAgentLeeCard() {
  // Prevent multiple initializations
  if (isAgentLeeCardInitialized) {
    console.log('Agent Lee Card already initialized, skipping initialization');
    return;
  }

  console.log('Initializing Agent Lee Card...');

  // First, remove any existing Agent Lee cards
  const existingCards = document.querySelectorAll('#agent-card, .agent-lee-card');
  if (existingCards.length > 0) {
    console.log(`Found ${existingCards.length} existing Agent Lee cards, removing them...`);
    existingCards.forEach(card => {
      console.log('Removing existing Agent Lee card');
      card.parentNode.removeChild(card);
    });
  }

  // Create the card element
  createAgentLeeCard();

  // Set up event listeners
  setupCardEventListeners();

  // Initialize AI capabilities
  initializeAICapabilities();

  // Mark as initialized
  isAgentLeeCardInitialized = true;

  console.log('Agent Lee Card initialization complete');
}

// Create the Agent Lee Card HTML
function createAgentLeeCard() {
  console.log('Creating Agent Lee Card...');

  // First, remove any existing Agent Lee cards
  const existingCards = document.querySelectorAll('#agent-card');
  if (existingCards.length > 0) {
    console.log(`Found ${existingCards.length} existing Agent Lee cards, removing them...`);
    existingCards.forEach(card => {
      console.log('Removing existing Agent Lee card');
      card.parentNode.removeChild(card);
    });
  }

  // Generate a unique ID for this card instance
  const uniqueId = 'agent-card';
  console.log(`Creating Agent Lee Card with ID: ${uniqueId}`);

  const cardHTML = `
    <div id="${uniqueId}" class="agent-lee-card hidden">
      <!-- Card Header -->
      <div class="card-header" id="drag-handle">
        <div class="avatar">👤</div>
        <div class="agent-details">
          <h3>Agent Lee</h3>
          <p>Your AI CRM Assistant</p>
        </div>
      </div>

      <!-- Navigation Grid -->
      <div class="navigation-grid">
        <button class="nav-button" data-section="Records">
          <span>📋</span>
          Records
        </button>
        <button class="nav-button" data-section="Phone">
          <span>📞</span>
          Phone
        </button>
        <button class="nav-button" data-section="Campaigns">
          <span>📢</span>
          Campaigns
        </button>
        <button class="nav-button" data-section="Analytics">
          <span>📊</span>
          Analytics
        </button>
        <button class="nav-button" data-section="Visits">
          <span>🗺️</span>
          Visits
        </button>
        <button class="nav-button" data-section="To-Dos">
          <span>✅</span>
          To-Dos
        </button>
      </div>

      <!-- Chat Area -->
      <div class="chat-area" id="chat-messages">
        <div class="empty-chat" id="empty-message">
          How can I assist you today?
        </div>
        <!-- Messages will be added here dynamically -->
      </div>

      <!-- Message Input -->
      <textarea
        class="message-input"
        id="message-input"
        rows="2"
        placeholder="Type your message..."></textarea>

      <!-- Control Buttons - First Row -->
      <div class="control-row">
        <button class="control-button send-btn" id="send-button">
          <span class="icon">✉️</span> Send
        </button>
        <button class="control-button listen-btn" id="listen-button">
          <span class="icon">🎤</span> Listen
        </button>
        <button class="control-button stop-btn" id="stop-button">
          <span class="icon">⏹️</span> Stop
        </button>
        <button class="control-button finish-btn" id="finish-button">
          <span class="icon">✅</span> Finish
        </button>
      </div>

      <!-- Control Buttons - Second Row -->
      <div class="control-row">
        <button class="control-button email-btn" id="email-button">
          <span class="icon">📧</span> Email
        </button>
        <button class="control-button phone-btn" id="phone-button">
          <span class="icon">📱</span> Phone
        </button>
        <button class="control-button schedule-btn" id="schedule-button">
          <span class="icon">📅</span> Schedule
        </button>
        <button class="control-button help-btn" id="help-button">
          <span class="icon">❓</span> Help
        </button>
      </div>
    </div>
  `;

  // Add the card to the body
  const cardContainer = document.createElement('div');
  cardContainer.innerHTML = cardHTML;
  document.body.appendChild(cardContainer.firstElementChild);
  console.log('Agent Lee Card added to DOM');

  // Add the card styles
  addCardStyles();
}

// Add the Agent Lee Card styles
function addCardStyles() {
  console.log('Adding Agent Lee Card styles...');

  // Check if styles already exist
  if (document.getElementById('agent-lee-card-styles')) {
    console.log('Agent Lee Card styles already exist, not adding again');
    return;
  }

  const styleElement = document.createElement('style');
  styleElement.id = 'agent-lee-card-styles';
  styleElement.textContent = `
    /* Agent Card Styles */
    #agent-card, .agent-lee-card {
      width: 320px;
      background-color: #1e293b;
      color: white;
      border-radius: 16px;
      border: 4px solid #3b82f6;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
      position: fixed;
      top: 50px;
      right: 50px;
      padding: 16px;
      z-index: 1000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    /* Card Header */
    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: move;
      margin-bottom: 16px;
    }

    .avatar {
      width: 48px;
      height: 48px;
      background-color: #64748b;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      border: 2px solid #93c5fd;
    }

    .agent-details h3 {
      color: #93c5fd;
      font-size: 18px;
      margin-bottom: 4px;
    }

    .agent-details p {
      color: #bfdbfe;
      font-size: 14px;
    }

    /* Navigation Grid */
    .navigation-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-bottom: 16px;
    }

    .nav-button {
      background-color: #334155;
      border: none;
      color: white;
      padding: 8px 4px;
      text-align: center;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .nav-button:hover {
      background-color: #475569;
    }

    .nav-button span {
      font-size: 16px;
      margin-bottom: 4px;
      color: #60a5fa;
    }

    /* Chat Area */
    .chat-area {
      height: 144px;
      background-color: #334155;
      border-radius: 8px;
      padding: 8px;
      margin-bottom: 8px;
      overflow-y: auto;
    }

    .message {
      padding: 8px;
      margin-bottom: 8px;
      border-radius: 8px;
    }

    .user-message {
      background-color: #475569;
      margin-left: 16px;
    }

    .agent-message {
      background-color: #3b82f6;
      margin-right: 16px;
    }

    .empty-chat {
      color: #94a3b8;
      text-align: center;
      font-style: italic;
      margin-top: 48px;
    }

    /* Message Input */
    .message-input {
      width: 100%;
      padding: 8px;
      border-radius: 8px;
      border: 1px solid #475569;
      background-color: #475569;
      color: white;
      resize: none;
      margin-bottom: 12px;
    }

    .message-input::placeholder {
      color: #94a3b8;
    }

    /* Control Buttons */
    .control-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 8px;
    }

    .control-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px 4px;
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 12px;
      cursor: pointer;
    }

    .send-btn { background-color: #2563eb; }
    .send-btn:hover { background-color: #3b82f6; }

    .listen-btn { background-color: #16a34a; }
    .listen-btn:hover { background-color: #22c55e; }

    .stop-btn { background-color: #dc2626; }
    .stop-btn:hover { background-color: #ef4444; }

    .finish-btn { background-color: #ca8a04; }
    .finish-btn:hover { background-color: #eab308; }

    .email-btn { background-color: #4f46e5; }
    .email-btn:hover { background-color: #6366f1; }

    .phone-btn { background-color: #0d9488; }
    .phone-btn:hover { background-color: #14b8a6; }

    .schedule-btn { background-color: #3b82f6; }
    .schedule-btn:hover { background-color: #60a5fa; }

    .help-btn { background-color: #9333ea; }
    .help-btn:hover { background-color: #a855f7; }

    /* Icons for buttons */
    .icon {
      margin-right: 4px;
    }
  `;

  document.head.appendChild(styleElement);
}

// Set up event listeners for the card
function setupCardEventListeners() {
  console.log('Setting up Agent Lee Card event listeners...');

  // Get DOM elements
  const agentCard = document.getElementById('agent-card');
  const dragHandle = document.getElementById('drag-handle');
  const chatMessages = document.getElementById('chat-messages');
  const emptyMessage = document.getElementById('empty-message');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const listenButton = document.getElementById('listen-button');
  const stopButton = document.getElementById('stop-button');
  const finishButton = document.getElementById('finish-button');
  const emailButton = document.getElementById('email-button');
  const phoneButton = document.getElementById('phone-button');
  const scheduleButton = document.getElementById('schedule-button');
  const helpButton = document.getElementById('help-button');
  const navButtons = document.querySelectorAll('.nav-button');

  if (!agentCard) {
    console.error('Agent card not found in DOM');
    return;
  }

  if (!dragHandle) {
    console.error('Drag handle not found in DOM');
    return;
  }

  console.log('Agent Lee Card elements found, setting up event listeners...');

  // Drag functionality
  let isDragging = false;
  let offsetX, offsetY;

  dragHandle.addEventListener('mousedown', (e) => {
    console.log('Drag started');
    isDragging = true;
    const rect = agentCard.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    agentCard.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    agentCard.style.left = `${e.clientX - offsetX}px`;
    agentCard.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      console.log('Drag ended');
      isDragging = false;
      if (agentCard) agentCard.style.cursor = 'default';
    }
  });

  // Chat functionality
  if (sendButton && messageInput) {
    console.log('Setting up send message functionality');

    // Remove any existing event listeners
    const newSendButton = sendButton.cloneNode(true);
    sendButton.parentNode.replaceChild(newSendButton, sendButton);

    // Add new event listener
    newSendButton.addEventListener('click', () => {
      console.log('Send button clicked');
      sendMessage();
    });

    // Remove any existing event listeners
    const newMessageInput = messageInput.cloneNode(true);
    messageInput.parentNode.replaceChild(newMessageInput, messageInput);

    // Add new event listener
    newMessageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        console.log('Enter key pressed in message input');
        e.preventDefault();
        sendMessage();
      }
    });
  } else {
    console.warn('Send button or message input not found');
  }

  // Navigation button click handlers
  if (navButtons && navButtons.length > 0) {
    console.log(`Setting up ${navButtons.length} navigation buttons`);
    navButtons.forEach(button => {
      // Remove any existing event listeners
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);

      // Add new event listener
      newButton.addEventListener('click', () => {
        const section = newButton.getAttribute('data-section');
        console.log(`Navigation button clicked: ${section}`);
        navigateToSection(section);
      });
    });
  } else {
    console.warn('No navigation buttons found');
  }

  // Voice input
  if (listenButton) {
    console.log('Setting up listen button');

    // Remove any existing event listeners
    const newListenButton = listenButton.cloneNode(true);
    listenButton.parentNode.replaceChild(newListenButton, listenButton);

    // Add new event listener
    newListenButton.addEventListener('click', () => {
      console.log('Listen button clicked');
      startVoiceInput();
    });
  } else {
    console.warn('Listen button not found');
  }

  if (stopButton) {
    console.log('Setting up stop button');

    // Remove any existing event listeners
    const newStopButton = stopButton.cloneNode(true);
    stopButton.parentNode.replaceChild(newStopButton, stopButton);

    // Add new event listener
    newStopButton.addEventListener('click', () => {
      console.log('Stop button clicked');
      stopVoiceInput();
    });
  } else {
    console.warn('Stop button not found');
  }

  // Other buttons
  if (emailButton) {
    console.log('Setting up email button');

    // Remove any existing event listeners
    const newEmailButton = emailButton.cloneNode(true);
    emailButton.parentNode.replaceChild(newEmailButton, emailButton);

    // Add new event listener
    newEmailButton.addEventListener('click', () => {
      console.log('Email button clicked');
      addMessage("I'd like to create an email campaign.", 'user');
      processAgentResponse("I can help you create an email campaign. Let's go to the Campaigns section.", 'Campaigns');
    });
  } else {
    console.warn('Email button not found');
  }

  if (phoneButton) {
    console.log('Setting up phone button');

    // Remove any existing event listeners
    const newPhoneButton = phoneButton.cloneNode(true);
    phoneButton.parentNode.replaceChild(newPhoneButton, phoneButton);

    // Add new event listener
    newPhoneButton.addEventListener('click', () => {
      console.log('Phone button clicked');
      addMessage("I need to make some calls.", 'user');
      processAgentResponse("I can help you manage your calls. Let's go to the Phone section.", 'Phone');
    });
  } else {
    console.warn('Phone button not found');
  }

  if (scheduleButton) {
    console.log('Setting up schedule button');

    // Remove any existing event listeners
    const newScheduleButton = scheduleButton.cloneNode(true);
    scheduleButton.parentNode.replaceChild(newScheduleButton, scheduleButton);

    // Add new event listener
    newScheduleButton.addEventListener('click', () => {
      console.log('Schedule button clicked');
      addMessage("I need to schedule some appointments.", 'user');
      processAgentResponse("I can help you schedule appointments. Let's go to the Visits section.", 'Visits');
    });
  } else {
    console.warn('Schedule button not found');
  }

  if (helpButton) {
    console.log('Setting up help button');

    // Remove any existing event listeners
    const newHelpButton = helpButton.cloneNode(true);
    helpButton.parentNode.replaceChild(newHelpButton, helpButton);

    // Add new event listener
    newHelpButton.addEventListener('click', () => {
      console.log('Help button clicked');
      addMessage("I need help using the CRM.", 'user');
      processAgentResponse("I'm here to help! What would you like to know about using the CRM?");
    });
  } else {
    console.warn('Help button not found');
  }

  // Add toggle button to show/hide the card
  console.log('Adding toggle button');
  addToggleButton();

  console.log('Agent Lee Card event listeners setup complete');
}

// Add a toggle button to show/hide the Agent Lee Card
function addToggleButton() {
  console.log('Adding toggle button for Agent Lee Card...');

  // Remove any existing toggle buttons
  const existingToggle = document.getElementById('agent-lee-toggle');
  if (existingToggle) {
    console.log('Removing existing toggle button');
    existingToggle.parentNode.removeChild(existingToggle);
  }

  const toggleButton = document.createElement('button');
  toggleButton.id = 'agent-lee-toggle';
  toggleButton.innerHTML = '👤';
  toggleButton.title = 'Toggle Agent Lee';

  // Style the toggle button
  toggleButton.style.position = 'fixed';
  toggleButton.style.bottom = '20px';
  toggleButton.style.right = '20px';
  toggleButton.style.width = '50px';
  toggleButton.style.height = '50px';
  toggleButton.style.borderRadius = '50%';
  toggleButton.style.backgroundColor = '#3b82f6';
  toggleButton.style.color = 'white';
  toggleButton.style.border = 'none';
  toggleButton.style.fontSize = '24px';
  toggleButton.style.cursor = 'pointer';
  toggleButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  toggleButton.style.zIndex = '999';
  toggleButton.style.display = 'flex';
  toggleButton.style.alignItems = 'center';
  toggleButton.style.justifyContent = 'center';

  // Add hover effect
  toggleButton.addEventListener('mouseover', () => {
    toggleButton.style.backgroundColor = '#2563eb';
  });

  toggleButton.addEventListener('mouseout', () => {
    toggleButton.style.backgroundColor = '#3b82f6';
  });

  // Add click event to toggle the card
  toggleButton.addEventListener('click', () => {
    console.log('Toggle button clicked');
    const agentCard = document.getElementById('agent-card') || document.querySelector('.agent-lee-card');

    if (agentCard) {
      console.log('Found Agent Lee Card, toggling visibility');
      if (agentCard.classList.contains('hidden')) {
        console.log('Card is hidden, showing it');
        agentCard.classList.remove('hidden');
        // Add welcome message if chat is empty
        if (document.getElementById('empty-message')) {
          setTimeout(() => {
            addMessage("Hello! I'm Agent Lee, your AI CRM assistant. How can I help you today?", 'agent');
          }, 500);
        }
      } else {
        console.log('Card is visible, hiding it');
        agentCard.classList.add('hidden');
      }
    } else {
      console.warn('Agent Lee Card not found, cannot toggle');
      // If card doesn't exist, create one
      console.log('Creating new Agent Lee Card');
      initializeAgentLeeCard();
    }
  });

  document.body.appendChild(toggleButton);
  console.log('Toggle button added to DOM');
}

// Send a message from the user
function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();
  if (!message) return;

  // Add user message
  addMessage(message, 'user');
  messageInput.value = '';

  // Process the message and generate a response
  processUserMessage(message);
}

// Add a message to the chat
function addMessage(text, sender) {
  const chatMessages = document.getElementById('chat-messages');
  const emptyMessage = document.getElementById('empty-message');

  if (!chatMessages) return;

  // Hide empty message if this is the first message
  if (emptyMessage) {
    emptyMessage.style.display = 'none';
  }

  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.classList.add(sender === 'user' ? 'user-message' : 'agent-message');
  messageElement.textContent = text;

  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Process user message and generate a response
function processUserMessage(message) {
  // Check for navigation commands
  const navigationKeywords = {
    'records': 'Records',
    'contacts': 'Records',
    'phone': 'Phone',
    'call': 'Phone',
    'campaign': 'Campaigns',
    'email': 'Campaigns',
    'analytics': 'Analytics',
    'stats': 'Analytics',
    'visits': 'Visits',
    'map': 'Visits',
    'todo': 'To-Dos',
    'task': 'To-Dos',
    'schedule': 'To-Dos'
  };

  // Check if message contains navigation keywords
  let targetSection = null;
  const messageLower = message.toLowerCase();

  for (const [keyword, section] of Object.entries(navigationKeywords)) {
    if (messageLower.includes(keyword)) {
      targetSection = section;
      break;
    }
  }

  // If we found a navigation target, navigate to that section
  if (targetSection) {
    processAgentResponse(`I'll help you with that. Let's go to the ${targetSection} section.`, targetSection);
    return;
  }

  // Check for scheduling-related queries
  if (messageLower.includes('schedule') || messageLower.includes('appointment') || messageLower.includes('meeting')) {
    processAgentResponse("I can help you schedule appointments. What date and time would you like to schedule?");
    return;
  }

  // Check for email campaign-related queries
  if (messageLower.includes('email campaign') || messageLower.includes('marketing')) {
    processAgentResponse("I can help you set up an email campaign. Would you like to create a new campaign or view existing ones?");
    return;
  }

  // Check for analytics-related queries
  if (messageLower.includes('analytics') || messageLower.includes('report') || messageLower.includes('data')) {
    processAgentResponse("I can help you analyze your data. Let's go to the Analytics section to see your performance metrics.", 'Analytics');
    return;
  }

  // Default response
  const defaultResponses = [
    "I'm here to help you manage your CRM. What specific area would you like assistance with?",
    "I can help with records, phone calls, campaigns, analytics, visits, and to-dos. What would you like to work on?",
    "How can I assist you with your customer relationship management today?",
    "I'm your AI assistant for the CRM. Let me know what you'd like to accomplish."
  ];

  const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  processAgentResponse(randomResponse);
}

// Process and display agent response
function processAgentResponse(response, navigateTo = null) {
  // Add a slight delay to make it feel more natural
  setTimeout(() => {
    // Add agent message
    addMessage(response, 'agent');

    // Navigate to section if specified
    if (navigateTo) {
      setTimeout(() => {
        navigateToSection(navigateTo);
      }, 500);
    }
  }, 1000);
}

// Navigate to a specific section of the CRM
function navigateToSection(section) {
  // Add user message
  addMessage(`I'd like to go to the ${section} section.`, 'user');

  // Find the tab element
  const tabElement = document.querySelector(`[data-tab="${section.toLowerCase()}"]`);

  if (tabElement) {
    // Click the tab to navigate
    tabElement.click();

    // Add agent response
    setTimeout(() => {
      const responses = {
        "Records": "Here are your contact records. You can view, edit, or add new contacts here.",
        "Phone": "This is the phone section where you can make calls and view call history.",
        "Campaigns": "In the campaigns section, you can create and manage email marketing campaigns.",
        "Analytics": "The analytics section shows your performance metrics and data visualizations.",
        "Visits": "The visits section helps you track and schedule in-person visits with your contacts.",
        "To-Dos": "Here you can manage your tasks and to-do items."
      };

      addMessage(responses[section] || `You're now in the ${section} section.`, 'agent');
    }, 1000);
  } else {
    // If tab doesn't exist, inform the user
    setTimeout(() => {
      addMessage(`I couldn't find the ${section} section. Please try another section.`, 'agent');
    }, 1000);
  }
}

// Start voice input
function startVoiceInput() {
  const listenButton = document.getElementById('listen-button');

  if (!window.LeewayTech?.Voice) {
    addMessage("Voice input is not available. Please type your message instead.", 'agent');
    return;
  }

  // Create status element
  const statusElement = document.getElementById('voice-status') || document.createElement('div');
  statusElement.id = 'voice-status';
  statusElement.className = 'message agent-message';
  statusElement.textContent = 'Listening...';

  // Add status element to chat
  const chatMessages = document.getElementById('chat-messages');
  if (chatMessages && !document.getElementById('voice-status')) {
    chatMessages.appendChild(statusElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Update button state
  if (listenButton) {
    listenButton.classList.add('bg-red-500');
    listenButton.classList.remove('bg-green-500');
  }

  // Initialize dictation
  window.LeewayTech.Voice.initDictation({
    onStart: function() {
      statusElement.textContent = 'Listening...';
    },
    onResult: function(text) {
      statusElement.textContent = text;
    },
    onFinalResult: function(text) {
      // Remove status element
      if (statusElement.parentNode) {
        statusElement.parentNode.removeChild(statusElement);
      }

      // Add user message
      addMessage(text, 'user');

      // Process the message
      processUserMessage(text);

      // Stop dictation
      stopVoiceInput();
    },
    onError: function(error) {
      statusElement.textContent = `Error: ${error}`;
      setTimeout(() => {
        if (statusElement.parentNode) {
          statusElement.parentNode.removeChild(statusElement);
        }
      }, 3000);

      stopVoiceInput();
    },
    onEnd: function() {
      stopVoiceInput();
    }
  });

  window.LeewayTech.Voice.startDictation();
}

// Stop voice input
function stopVoiceInput() {
  const listenButton = document.getElementById('listen-button');

  if (window.LeewayTech?.Voice) {
    window.LeewayTech.Voice.stopDictation();
  }

  // Update button state
  if (listenButton) {
    listenButton.classList.remove('bg-red-500');
    listenButton.classList.add('bg-green-500');
  }

  // Remove status element
  const statusElement = document.getElementById('voice-status');
  if (statusElement && statusElement.parentNode) {
    statusElement.parentNode.removeChild(statusElement);
  }
}

// Initialize AI capabilities
function initializeAICapabilities() {
  // This function will be expanded as we add more AI features
  console.log('Initializing AI capabilities for Agent Lee...');
}

// Export the functions
window.AgentLeeCard = {
  initialize: initializeAgentLeeCard,
  show: function() {
    console.log('Showing Agent Lee Card...');
    const agentCard = document.getElementById('agent-card') || document.querySelector('.agent-lee-card');
    if (agentCard) {
      console.log('Found Agent Lee Card, showing it');
      agentCard.classList.remove('hidden');
    } else {
      console.warn('Agent Lee Card not found, cannot show');
    }
  },
  hide: function() {
    console.log('Hiding Agent Lee Card...');
    const agentCard = document.getElementById('agent-card') || document.querySelector('.agent-lee-card');
    if (agentCard) {
      console.log('Found Agent Lee Card, hiding it');
      agentCard.classList.add('hidden');
    } else {
      console.warn('Agent Lee Card not found, cannot hide');
    }
  },
  addMessage: addMessage,
  // Add a method to check if the card exists
  exists: function() {
    const agentCard = document.getElementById('agent-card') || document.querySelector('.agent-lee-card');
    return !!agentCard;
  }
};
