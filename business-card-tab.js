/**
 * Business Card Tab Functionality
 * Handles the functionality for the buttons in business-card-tab.html
 */

// Track initialization state
let isBusinessCardTabInitialized = false;

// Initialize the Business Card Tab functionality
function initializeBusinessCardTab() {
  // Prevent multiple initializations
  if (isBusinessCardTabInitialized) {
    console.log('Business Card Tab already initialized, skipping initialization');
    return;
  }

  console.log('Initializing Business Card Tab...');

  // Set up event listeners for all buttons
  setupButtonEventListeners();

  // Initialize voice dictation
  initializeVoiceDictation();

  // Mark as initialized
  isBusinessCardTabInitialized = true;

  console.log('Business Card Tab initialization complete');
}

// Set up event listeners for all buttons
function setupButtonEventListeners() {
  console.log('Setting up Business Card Tab button event listeners...');

  // Get all buttons
  const listenBtn = document.getElementById('listen-btn');
  const stopBtn = document.getElementById('stop-btn');
  const finishBtn = document.getElementById('finish-btn');
  const saveBtn = document.getElementById('save-btn');
  const emailBtn = document.getElementById('email-btn');
  const phoneBtn = document.getElementById('phone-btn');
  const textBtn = document.getElementById('text-btn');

  // Listen button
  if (listenBtn) {
    listenBtn.addEventListener('click', function() {
      console.log('Listen button clicked');
      startVoiceDictation();
    });
  } else {
    console.warn('Listen button not found');
  }

  // Stop button
  if (stopBtn) {
    stopBtn.addEventListener('click', function() {
      console.log('Stop button clicked');
      stopVoiceDictation();
    });
  } else {
    console.warn('Stop button not found');
  }

  // Finish button
  if (finishBtn) {
    finishBtn.addEventListener('click', function() {
      console.log('Finish button clicked');
      finishVoiceDictation();
    });
  } else {
    console.warn('Finish button not found');
  }

  // Save Contact button
  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      console.log('Save Contact button clicked');
      saveContact();
    });
  } else {
    console.warn('Save Contact button not found');
  }

  // Email button
  if (emailBtn) {
    emailBtn.addEventListener('click', function() {
      console.log('Email button clicked');
      sendEmail();
    });
  } else {
    console.warn('Email button not found');
  }

  // Phone button
  if (phoneBtn) {
    phoneBtn.addEventListener('click', function() {
      console.log('Phone button clicked');
      makePhoneCall();
    });
  } else {
    console.warn('Phone button not found');
  }

  // Text button
  if (textBtn) {
    textBtn.addEventListener('click', function() {
      console.log('Text button clicked');
      sendTextMessage();
    });
  } else {
    console.warn('Text button not found');
  }
}

// Voice dictation variables
let recognition = null;
let isListening = false;
let dictationText = '';

// Initialize voice dictation
function initializeVoiceDictation() {
  console.log('Initializing voice dictation...');

  // Check if LeewayTech.Voice is available
  if (window.LeewayTech && window.LeewayTech.Voice) {
    console.log('Using LeewayTech.Voice for dictation');
    // LeewayTech.Voice will be used in the startVoiceDictation function
  } else {
    console.warn('LeewayTech.Voice not available, using Web Speech API directly');
    
    // Check if Web Speech API is available
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Web Speech API not supported in this browser');
      alert('Voice dictation is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    // Create recognition object
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // Set up recognition event handlers
    recognition.onstart = function() {
      console.log('Voice dictation started');
      isListening = true;
      updateButtonStates();
    };

    recognition.onresult = function(event) {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        dictationText += finalTranscript + ' ';
        console.log('Final transcript:', finalTranscript);
      }

      // Display the current dictation text
      displayDictationText(dictationText + interimTranscript);
    };

    recognition.onerror = function(event) {
      console.error('Voice dictation error:', event.error);
      isListening = false;
      updateButtonStates();
    };

    recognition.onend = function() {
      console.log('Voice dictation ended');
      isListening = false;
      updateButtonStates();
    };
  }
}

// Start voice dictation
function startVoiceDictation() {
  console.log('Starting voice dictation...');

  // Check if already listening
  if (isListening) {
    console.log('Already listening, ignoring start request');
    return;
  }

  // Reset dictation text if starting fresh
  dictationText = '';
  displayDictationText('Listening...');

  // Start dictation using LeewayTech.Voice if available
  if (window.LeewayTech && window.LeewayTech.Voice) {
    window.LeewayTech.Voice.initDictation({
      onStart: function() {
        console.log('Voice dictation started via LeewayTech.Voice');
        isListening = true;
        updateButtonStates();
      },
      onResult: function(text) {
        console.log('Interim result:', text);
        displayDictationText(text);
      },
      onFinalResult: function(text) {
        console.log('Final result:', text);
        dictationText = text;
        displayDictationText(text);
      },
      onError: function(error) {
        console.error('Voice dictation error:', error);
        isListening = false;
        updateButtonStates();
      },
      onEnd: function() {
        console.log('Voice dictation ended');
        isListening = false;
        updateButtonStates();
      }
    });

    window.LeewayTech.Voice.startDictation();
  } else if (recognition) {
    // Start dictation using Web Speech API
    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting voice dictation:', error);
    }
  } else {
    console.error('No voice dictation system available');
    alert('Voice dictation is not available. Please check your browser compatibility.');
  }
}

// Stop voice dictation
function stopVoiceDictation() {
  console.log('Stopping voice dictation...');

  // Check if not listening
  if (!isListening) {
    console.log('Not listening, ignoring stop request');
    return;
  }

  // Stop dictation using LeewayTech.Voice if available
  if (window.LeewayTech && window.LeewayTech.Voice) {
    window.LeewayTech.Voice.stopDictation();
  } else if (recognition) {
    // Stop dictation using Web Speech API
    try {
      recognition.stop();
    } catch (error) {
      console.error('Error stopping voice dictation:', error);
    }
  }

  isListening = false;
  updateButtonStates();
}

// Finish voice dictation
function finishVoiceDictation() {
  console.log('Finishing voice dictation...');

  // Stop dictation if still listening
  if (isListening) {
    stopVoiceDictation();
  }

  // Process the dictation text
  processDictationText(dictationText);
}

// Process dictation text
function processDictationText(text) {
  console.log('Processing dictation text:', text);

  // Check if text is empty
  if (!text || text.trim() === '') {
    console.warn('No dictation text to process');
    return;
  }

  // Extract contact information from text
  extractContactInfo(text);
}

// Extract contact information from dictation text
function extractContactInfo(text) {
  console.log('Extracting contact information from text:', text);

  // Use LeewayAI if available
  if (window.LeewayAI) {
    console.log('Using LeewayAI to extract contact information');
    
    // Show loading state
    displayDictationText('Processing...');

    // Use AI to extract contact information
    window.LeewayAI.generateText(`
      Extract contact information from the following text:
      ${text}
      
      Format the response as JSON with these fields:
      {
        "name": "Full name",
        "email": "Email address",
        "phone": "Phone number",
        "company": "Company name",
        "position": "Job title",
        "notes": "Additional notes"
      }
      
      Only include fields that are present in the text.
    `).then(response => {
      console.log('AI response:', response);
      
      try {
        // Try to parse the response as JSON
        const contactInfo = JSON.parse(response);
        
        // Fill in the contact form
        fillContactForm(contactInfo);
      } catch (error) {
        console.error('Error parsing AI response:', error);
        
        // Try to extract information manually
        const contactInfo = extractContactInfoManually(text);
        fillContactForm(contactInfo);
      }
    }).catch(error => {
      console.error('Error using AI to extract contact information:', error);
      
      // Fall back to manual extraction
      const contactInfo = extractContactInfoManually(text);
      fillContactForm(contactInfo);
    });
  } else {
    console.log('LeewayAI not available, extracting contact information manually');
    
    // Extract information manually
    const contactInfo = extractContactInfoManually(text);
    fillContactForm(contactInfo);
  }
}

// Extract contact information manually
function extractContactInfoManually(text) {
  console.log('Extracting contact information manually');

  // Simple regex patterns for common contact information
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phonePattern = /\b(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/;
  
  // Extract information
  const email = text.match(emailPattern) ? text.match(emailPattern)[0] : '';
  const phone = text.match(phonePattern) ? text.match(phonePattern)[0] : '';
  
  // Try to extract name (assume it's at the beginning of the text)
  let name = '';
  const firstLine = text.split('\n')[0] || text.split('.')[0] || '';
  if (firstLine.length < 50) { // Assume name is not too long
    name = firstLine.trim();
  }
  
  return {
    name: name,
    email: email,
    phone: phone,
    company: '',
    position: '',
    notes: text
  };
}

// Fill contact form with extracted information
function fillContactForm(contactInfo) {
  console.log('Filling contact form with:', contactInfo);

  // Display the extracted information
  let formattedInfo = '';
  
  if (contactInfo.name) formattedInfo += `<strong>Name:</strong> ${contactInfo.name}<br>`;
  if (contactInfo.email) formattedInfo += `<strong>Email:</strong> ${contactInfo.email}<br>`;
  if (contactInfo.phone) formattedInfo += `<strong>Phone:</strong> ${contactInfo.phone}<br>`;
  if (contactInfo.company) formattedInfo += `<strong>Company:</strong> ${contactInfo.company}<br>`;
  if (contactInfo.position) formattedInfo += `<strong>Position:</strong> ${contactInfo.position}<br>`;
  if (contactInfo.notes) formattedInfo += `<strong>Notes:</strong> ${contactInfo.notes}<br>`;
  
  displayDictationText(formattedInfo);
  
  // Store the contact information for later use
  window.currentContactInfo = contactInfo;
}

// Display dictation text
function displayDictationText(text) {
  // Create or get the dictation display element
  let dictationDisplay = document.getElementById('dictation-display');
  
  if (!dictationDisplay) {
    // Create the display element if it doesn't exist
    dictationDisplay = document.createElement('div');
    dictationDisplay.id = 'dictation-display';
    dictationDisplay.className = 'mt-4 p-4 bg-white dark:bg-dark-700 rounded-lg shadow';
    
    // Add it after the control rows
    const controlRows = document.querySelectorAll('.control-row');
    if (controlRows.length > 0) {
      const lastControlRow = controlRows[controlRows.length - 1];
      lastControlRow.parentNode.insertBefore(dictationDisplay, lastControlRow.nextSibling);
    } else {
      // If control rows not found, add to the body
      document.body.appendChild(dictationDisplay);
    }
  }
  
  // Update the display
  if (text.startsWith('<')) {
    // If text contains HTML
    dictationDisplay.innerHTML = text;
  } else {
    // Plain text
    dictationDisplay.textContent = text;
  }
}

// Update button states based on listening state
function updateButtonStates() {
  const listenBtn = document.getElementById('listen-btn');
  const stopBtn = document.getElementById('stop-btn');
  
  if (listenBtn) {
    listenBtn.disabled = isListening;
  }
  
  if (stopBtn) {
    stopBtn.disabled = !isListening;
  }
}

// Save contact information
function saveContact() {
  console.log('Saving contact...');
  
  // Check if we have contact information
  if (!window.currentContactInfo) {
    console.warn('No contact information to save');
    alert('Please dictate contact information first.');
    return;
  }
  
  // Save to IndexedDB
  saveContactToDatabase(window.currentContactInfo);
}

// Save contact to IndexedDB
async function saveContactToDatabase(contactInfo) {
  try {
    console.log('Saving contact to database:', contactInfo);
    
    // Check if IndexedDB is available
    if (typeof idbKeyval === 'undefined') {
      console.error('idb-keyval library not loaded');
      alert('Error: Database library not loaded. Contact could not be saved.');
      return;
    }
    
    // Create store
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'contacts-store');
    
    // Get existing contacts
    const contacts = await idbKeyval.get('contacts', dbPromise) || [];
    
    // Add new contact with ID and timestamp
    contacts.push({
      ...contactInfo,
      id: Date.now(),
      timestamp: new Date().toISOString()
    });
    
    // Save contacts
    await idbKeyval.set('contacts', contacts, dbPromise);
    
    console.log('Contact saved successfully');
    alert('Contact saved successfully!');
    
    // Clear current contact info
    window.currentContactInfo = null;
    
    // Clear dictation display
    displayDictationText('Contact saved successfully!');
  } catch (error) {
    console.error('Error saving contact:', error);
    alert('Error saving contact: ' + error.message);
  }
}

// Send email to contact
function sendEmail() {
  console.log('Sending email...');
  
  // Check if we have contact information
  if (!window.currentContactInfo || !window.currentContactInfo.email) {
    console.warn('No contact email to use');
    alert('Please dictate contact information with an email address first.');
    return;
  }
  
  // Open email client
  const email = window.currentContactInfo.email;
  const subject = 'Follow-up from Leonard Lee';
  const body = 'Hello ' + (window.currentContactInfo.name || '') + ',\n\nThank you for your time today. I wanted to follow up on our conversation.';
  
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Make phone call to contact
function makePhoneCall() {
  console.log('Making phone call...');
  
  // Check if we have contact information
  if (!window.currentContactInfo || !window.currentContactInfo.phone) {
    console.warn('No contact phone to use');
    alert('Please dictate contact information with a phone number first.');
    return;
  }
  
  // Format phone number for tel: protocol
  const phone = window.currentContactInfo.phone.replace(/\D/g, '');
  
  // Open phone app
  window.location.href = `tel:${phone}`;
}

// Send text message to contact
function sendTextMessage() {
  console.log('Sending text message...');
  
  // Check if we have contact information
  if (!window.currentContactInfo || !window.currentContactInfo.phone) {
    console.warn('No contact phone to use');
    alert('Please dictate contact information with a phone number first.');
    return;
  }
  
  // Format phone number for sms: protocol
  const phone = window.currentContactInfo.phone.replace(/\D/g, '');
  const message = 'Hello ' + (window.currentContactInfo.name || '') + ', this is Leonard Lee following up on our conversation.';
  
  // Open SMS app
  window.location.href = `sms:${phone}?body=${encodeURIComponent(message)}`;
}

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize with a slight delay to ensure all dependencies are loaded
  setTimeout(initializeBusinessCardTab, 500);
});

// Export functions for external use
window.BusinessCardTab = {
  initialize: initializeBusinessCardTab,
  startVoiceDictation: startVoiceDictation,
  stopVoiceDictation: stopVoiceDictation,
  finishVoiceDictation: finishVoiceDictation,
  saveContact: saveContact,
  sendEmail: sendEmail,
  makePhoneCall: makePhoneCall,
  sendTextMessage: sendTextMessage
};
