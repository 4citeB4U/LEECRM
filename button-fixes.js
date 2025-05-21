/**
 * Button Fixes for Agent Lee CRM
 * This file ensures all buttons in the application are properly initialized and functional
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing button fixes...');
  
  // Wait for all scripts to load
  setTimeout(function() {
    // Fix all buttons in the application
    fixAllButtons();
    
    // Fix form submission buttons
    fixFormButtons();
    
    // Fix navigation buttons
    fixNavigationButtons();
    
    // Fix modal buttons
    fixModalButtons();
    
    // Fix business card buttons
    fixBusinessCardButtons();
    
    console.log('Button fixes applied successfully');
  }, 1000);
});

/**
 * Fix all buttons in the application
 */
function fixAllButtons() {
  console.log('Fixing all buttons...');
  
  // Get all buttons in the application
  const buttons = document.querySelectorAll('button');
  
  // Add click event listeners to all buttons
  buttons.forEach(function(button) {
    // Skip buttons that already have event listeners
    if (button.hasAttribute('data-fixed')) {
      return;
    }
    
    // Add click sound effect
    button.addEventListener('click', function() {
      // Play click sound if available
      if (typeof playClickSound === 'function') {
        playClickSound();
      }
      
      // Log button click
      console.log('Button clicked:', button.textContent.trim() || button.id || 'unnamed button');
    });
    
    // Mark button as fixed
    button.setAttribute('data-fixed', 'true');
    
    // Ensure button has type attribute
    if (!button.hasAttribute('type')) {
      // Default to 'button' type to prevent form submission
      button.setAttribute('type', 'button');
    }
    
    // Ensure button has aria-label if it only contains an icon
    if (!button.textContent.trim() && !button.hasAttribute('aria-label')) {
      const iconDescription = button.querySelector('svg') ? 'icon button' : 'button';
      button.setAttribute('aria-label', iconDescription);
    }
  });
}

/**
 * Fix form submission buttons
 */
function fixFormButtons() {
  console.log('Fixing form submission buttons...');
  
  // Get all forms in the application
  const forms = document.querySelectorAll('form');
  
  // Fix each form
  forms.forEach(function(form) {
    // Skip forms that already have event listeners
    if (form.hasAttribute('data-fixed')) {
      return;
    }
    
    // Get submit button
    const submitButton = form.querySelector('button[type="submit"]') || 
                         form.querySelector('input[type="submit"]');
    
    if (submitButton) {
      // Ensure form has submit event listener
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Log form submission
        console.log('Form submitted:', form.id || 'unnamed form');
        
        // Get form data
        const formData = new FormData(form);
        const formValues = {};
        
        // Convert FormData to object
        for (const [key, value] of formData.entries()) {
          formValues[key] = value;
        }
        
        console.log('Form values:', formValues);
        
        // Process form submission based on form ID
        processFormSubmission(form.id, formValues);
      });
    }
    
    // Mark form as fixed
    form.setAttribute('data-fixed', 'true');
  });
}

/**
 * Process form submission based on form ID
 */
function processFormSubmission(formId, formValues) {
  switch (formId) {
    case 'contact-form':
      // Process contact form
      if (typeof saveContactToDatabase === 'function') {
        saveContactToDatabase(formValues);
      }
      break;
    case 'campaign-form':
      // Process campaign form
      if (typeof saveCampaignToDatabase === 'function') {
        saveCampaignToDatabase(formValues);
      }
      break;
    case 'todo-form':
      // Process todo form
      if (typeof saveTodoToDatabase === 'function') {
        saveTodoToDatabase(formValues);
      }
      break;
    case 'schedule-form':
      // Process schedule form
      if (typeof saveScheduleToDatabase === 'function') {
        saveScheduleToDatabase(formValues);
      }
      break;
    default:
      // Generic form processing
      console.log('No specific handler for form:', formId);
      // Show success message
      alert('Form submitted successfully!');
  }
}

/**
 * Fix navigation buttons
 */
function fixNavigationButtons() {
  console.log('Fixing navigation buttons...');
  
  // Get all tab buttons
  const tabButtons = document.querySelectorAll('[data-tab]');
  
  // Fix each tab button
  tabButtons.forEach(function(button) {
    // Skip buttons that already have event listeners
    if (button.hasAttribute('data-tab-fixed')) {
      return;
    }
    
    // Remove existing event listeners
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    // Add new event listener
    newButton.addEventListener('click', function() {
      const tabName = this.dataset.tab;
      
      // Activate tab
      activateTab(tabName);
    });
    
    // Mark button as fixed
    newButton.setAttribute('data-tab-fixed', 'true');
  });
}

/**
 * Activate tab
 */
function activateTab(tabName) {
  console.log('Activating tab:', tabName);
  
  // Get all tab buttons
  const tabButtons = document.querySelectorAll('[data-tab]');
  
  // Get all tab contents
  const tabContents = document.querySelectorAll('[data-tab-content]');
  
  // Update active tab button
  tabButtons.forEach(function(button) {
    if (button.dataset.tab === tabName) {
      button.classList.add('active-tab');
    } else {
      button.classList.remove('active-tab');
    }
  });
  
  // Show active tab content
  tabContents.forEach(function(content) {
    if (content.dataset.tabContent === tabName) {
      content.classList.remove('hidden');
    } else {
      content.classList.add('hidden');
    }
  });
  
  // Save active tab to localStorage
  localStorage.setItem('activeTab', tabName);
  
  // Load tab-specific data
  if (tabName === 'dashboard') {
    if (typeof loadDashboardData === 'function') {
      loadDashboardData();
    }
  } else if (tabName === 'analytics') {
    if (typeof createAnalyticsCharts === 'function') {
      createAnalyticsCharts();
    }
  } else if (tabName === 'business-card') {
    if (typeof initializeBusinessCardMap === 'function') {
      initializeBusinessCardMap();
    }
    // Initialize business card tab functionality
    if (window.BusinessCardTab && typeof window.BusinessCardTab.initialize === 'function') {
      window.BusinessCardTab.initialize();
    }
  } else if (tabName === 'campaigns') {
    if (window.EmailCampaignScheduler && typeof window.EmailCampaignScheduler.loadEmailCampaigns === 'function') {
      window.EmailCampaignScheduler.loadEmailCampaigns();
    }
  } else if (tabName === 'todos') {
    if (window.LeewayAIFeatures && typeof window.LeewayAIFeatures.loadToDos === 'function') {
      window.LeewayAIFeatures.loadToDos();
    }
  }
}

/**
 * Fix modal buttons
 */
function fixModalButtons() {
  console.log('Fixing modal buttons...');
  
  // Get all modal open buttons
  const modalOpenButtons = document.querySelectorAll('[data-modal-open]');
  
  // Fix each modal open button
  modalOpenButtons.forEach(function(button) {
    // Skip buttons that already have event listeners
    if (button.hasAttribute('data-modal-fixed')) {
      return;
    }
    
    // Add click event listener
    button.addEventListener('click', function() {
      const modalId = this.dataset.modalOpen;
      const modal = document.getElementById(modalId);
      
      if (modal) {
        modal.classList.remove('hidden');
      }
    });
    
    // Mark button as fixed
    button.setAttribute('data-modal-fixed', 'true');
  });
  
  // Get all modal close buttons
  const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
  
  // Fix each modal close button
  modalCloseButtons.forEach(function(button) {
    // Skip buttons that already have event listeners
    if (button.hasAttribute('data-modal-fixed')) {
      return;
    }
    
    // Add click event listener
    button.addEventListener('click', function() {
      const modalId = this.dataset.modalClose;
      const modal = document.getElementById(modalId);
      
      if (modal) {
        modal.classList.add('hidden');
      }
    });
    
    // Mark button as fixed
    button.setAttribute('data-modal-fixed', 'true');
  });
}

/**
 * Fix business card buttons
 */
function fixBusinessCardButtons() {
  console.log('Fixing business card buttons...');
  
  // Get all business card buttons
  const listenBtn = document.getElementById('listen-btn');
  const stopBtn = document.getElementById('stop-btn');
  const finishBtn = document.getElementById('finish-btn');
  const saveBtn = document.getElementById('save-btn');
  const emailBtn = document.getElementById('email-btn');
  const phoneBtn = document.getElementById('phone-btn');
  const textBtn = document.getElementById('text-btn');
  
  // Fix listen button
  if (listenBtn && !listenBtn.hasAttribute('data-fixed')) {
    listenBtn.addEventListener('click', function() {
      console.log('Listen button clicked');
      if (window.BusinessCardTab && typeof window.BusinessCardTab.startVoiceDictation === 'function') {
        window.BusinessCardTab.startVoiceDictation();
      }
    });
    listenBtn.setAttribute('data-fixed', 'true');
  }
  
  // Fix stop button
  if (stopBtn && !stopBtn.hasAttribute('data-fixed')) {
    stopBtn.addEventListener('click', function() {
      console.log('Stop button clicked');
      if (window.BusinessCardTab && typeof window.BusinessCardTab.stopVoiceDictation === 'function') {
        window.BusinessCardTab.stopVoiceDictation();
      }
    });
    stopBtn.setAttribute('data-fixed', 'true');
  }
  
  // Fix finish button
  if (finishBtn && !finishBtn.hasAttribute('data-fixed')) {
    finishBtn.addEventListener('click', function() {
      console.log('Finish button clicked');
      if (window.BusinessCardTab && typeof window.BusinessCardTab.finishVoiceDictation === 'function') {
        window.BusinessCardTab.finishVoiceDictation();
      }
    });
    finishBtn.setAttribute('data-fixed', 'true');
  }
  
  // Fix save button
  if (saveBtn && !saveBtn.hasAttribute('data-fixed')) {
    saveBtn.addEventListener('click', function() {
      console.log('Save button clicked');
      if (window.BusinessCardTab && typeof window.BusinessCardTab.saveContact === 'function') {
        window.BusinessCardTab.saveContact();
      }
    });
    saveBtn.setAttribute('data-fixed', 'true');
  }
  
  // Fix email button
  if (emailBtn && !emailBtn.hasAttribute('data-fixed')) {
    emailBtn.addEventListener('click', function() {
      console.log('Email button clicked');
      if (window.BusinessCardTab && typeof window.BusinessCardTab.sendEmail === 'function') {
        window.BusinessCardTab.sendEmail();
      }
    });
    emailBtn.setAttribute('data-fixed', 'true');
  }
  
  // Fix phone button
  if (phoneBtn && !phoneBtn.hasAttribute('data-fixed')) {
    phoneBtn.addEventListener('click', function() {
      console.log('Phone button clicked');
      if (window.BusinessCardTab && typeof window.BusinessCardTab.makePhoneCall === 'function') {
        window.BusinessCardTab.makePhoneCall();
      }
    });
    phoneBtn.setAttribute('data-fixed', 'true');
  }
  
  // Fix text button
  if (textBtn && !textBtn.hasAttribute('data-fixed')) {
    textBtn.addEventListener('click', function() {
      console.log('Text button clicked');
      if (window.BusinessCardTab && typeof window.BusinessCardTab.sendTextMessage === 'function') {
        window.BusinessCardTab.sendTextMessage();
      }
    });
    textBtn.setAttribute('data-fixed', 'true');
  }
}
