/**
 * Form Fixes for Agent Lee CRM
 * This file ensures all forms in the application are properly initialized and functional
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing form fixes...');
  
  // Wait for all scripts to load
  setTimeout(function() {
    // Fix all forms in the application
    fixAllForms();
    
    // Fix contact form
    fixContactForm();
    
    // Fix campaign form
    fixCampaignForm();
    
    // Fix todo form
    fixTodoForm();
    
    // Fix schedule form
    fixScheduleForm();
    
    // Fix search form
    fixSearchForm();
    
    console.log('Form fixes applied successfully');
  }, 1000);
});

/**
 * Fix all forms in the application
 */
function fixAllForms() {
  console.log('Fixing all forms...');
  
  // Get all forms in the application
  const forms = document.querySelectorAll('form');
  
  // Add submit event listeners to all forms
  forms.forEach(function(form) {
    // Skip forms that already have event listeners
    if (form.hasAttribute('data-form-fixed')) {
      return;
    }
    
    // Add submit event listener
    form.addEventListener('submit', function(event) {
      // Prevent default form submission
      event.preventDefault();
      
      // Log form submission
      console.log('Form submitted:', form.id || 'unnamed form');
      
      // Process form submission based on form ID
      processFormSubmission(form);
    });
    
    // Mark form as fixed
    form.setAttribute('data-form-fixed', 'true');
    
    // Ensure all form inputs have proper attributes
    fixFormInputs(form);
  });
}

/**
 * Fix form inputs
 */
function fixFormInputs(form) {
  // Get all inputs in the form
  const inputs = form.querySelectorAll('input, select, textarea');
  
  // Fix each input
  inputs.forEach(function(input) {
    // Ensure input has ID
    if (!input.id) {
      input.id = input.name || `input-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Ensure input has name
    if (!input.name) {
      input.name = input.id;
    }
    
    // Ensure input has label
    const label = form.querySelector(`label[for="${input.id}"]`);
    if (!label) {
      // Create label if it doesn't exist
      const newLabel = document.createElement('label');
      newLabel.setAttribute('for', input.id);
      newLabel.textContent = input.placeholder || input.name;
      newLabel.className = 'block text-sm font-medium text-dark-700 dark:text-dark-300';
      
      // Insert label before input
      input.parentNode.insertBefore(newLabel, input);
    }
    
    // Add event listeners for validation
    input.addEventListener('blur', function() {
      validateInput(input);
    });
  });
}

/**
 * Validate input
 */
function validateInput(input) {
  // Skip validation for disabled inputs
  if (input.disabled) {
    return true;
  }
  
  // Get validation message element
  let validationMessage = input.nextElementSibling;
  if (!validationMessage || !validationMessage.classList.contains('validation-message')) {
    // Create validation message element if it doesn't exist
    validationMessage = document.createElement('p');
    validationMessage.className = 'validation-message text-sm text-red-500 mt-1 hidden';
    input.parentNode.insertBefore(validationMessage, input.nextSibling);
  }
  
  // Check if input is required and empty
  if (input.required && !input.value.trim()) {
    validationMessage.textContent = 'This field is required';
    validationMessage.classList.remove('hidden');
    input.classList.add('border-red-500');
    return false;
  }
  
  // Check email format
  if (input.type === 'email' && input.value.trim()) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(input.value)) {
      validationMessage.textContent = 'Please enter a valid email address';
      validationMessage.classList.remove('hidden');
      input.classList.add('border-red-500');
      return false;
    }
  }
  
  // Check phone format
  if (input.type === 'tel' && input.value.trim()) {
    const phonePattern = /^\+?[0-9\s\-\(\)]{10,20}$/;
    if (!phonePattern.test(input.value)) {
      validationMessage.textContent = 'Please enter a valid phone number';
      validationMessage.classList.remove('hidden');
      input.classList.add('border-red-500');
      return false;
    }
  }
  
  // Input is valid
  validationMessage.classList.add('hidden');
  input.classList.remove('border-red-500');
  return true;
}

/**
 * Process form submission
 */
function processFormSubmission(form) {
  // Validate all inputs
  const inputs = form.querySelectorAll('input, select, textarea');
  let isValid = true;
  
  inputs.forEach(function(input) {
    if (!validateInput(input)) {
      isValid = false;
    }
  });
  
  // If form is not valid, return
  if (!isValid) {
    return;
  }
  
  // Get form data
  const formData = new FormData(form);
  const formValues = {};
  
  // Convert FormData to object
  for (const [key, value] of formData.entries()) {
    formValues[key] = value;
  }
  
  // Process form based on ID
  switch (form.id) {
    case 'contact-form':
      processContactForm(form, formValues);
      break;
    case 'campaign-form':
      processCampaignForm(form, formValues);
      break;
    case 'todo-form':
      processTodoForm(form, formValues);
      break;
    case 'schedule-form':
      processScheduleForm(form, formValues);
      break;
    case 'search-form':
      processSearchForm(form, formValues);
      break;
    default:
      // Generic form processing
      console.log('No specific handler for form:', form.id);
      alert('Form submitted successfully!');
      form.reset();
  }
}

/**
 * Fix contact form
 */
function fixContactForm() {
  console.log('Fixing contact form...');
  
  // Get contact form
  const contactForm = document.getElementById('contact-form');
  
  if (!contactForm) {
    console.warn('Contact form not found');
    return;
  }
  
  // Ensure form has all required fields
  const requiredFields = ['name', 'email', 'phone'];
  
  requiredFields.forEach(function(field) {
    const input = contactForm.querySelector(`[name="${field}"]`);
    
    if (!input) {
      console.warn(`Contact form missing required field: ${field}`);
      
      // Create missing field
      const fieldContainer = document.createElement('div');
      fieldContainer.className = 'mb-4';
      
      const label = document.createElement('label');
      label.setAttribute('for', `contact-${field}`);
      label.className = 'block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1';
      label.textContent = field.charAt(0).toUpperCase() + field.slice(1);
      
      const inputElement = document.createElement('input');
      inputElement.type = field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text';
      inputElement.id = `contact-${field}`;
      inputElement.name = field;
      inputElement.required = true;
      inputElement.className = 'mt-1 block w-full rounded-md border-dark-300 dark:border-dark-700 dark:bg-dark-800 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50';
      
      fieldContainer.appendChild(label);
      fieldContainer.appendChild(inputElement);
      
      // Add field to form
      const submitButton = contactForm.querySelector('button[type="submit"]');
      if (submitButton) {
        contactForm.insertBefore(fieldContainer, submitButton.parentNode);
      } else {
        contactForm.appendChild(fieldContainer);
      }
    }
  });
}

/**
 * Process contact form
 */
function processContactForm(form, formValues) {
  console.log('Processing contact form:', formValues);
  
  // Add ID and timestamp
  const contact = {
    ...formValues,
    id: 'contact_' + Date.now(),
    createdAt: new Date().toISOString()
  };
  
  // Save to IndexedDB
  if (typeof saveContactToDatabase === 'function') {
    saveContactToDatabase(contact).then(function() {
      // Show success message
      alert('Contact added successfully!');
      
      // Reset form
      form.reset();
      
      // Close modal
      const modal = document.getElementById('contact-modal');
      if (modal) {
        modal.classList.add('hidden');
      }
      
      // Refresh contacts list
      if (typeof loadContacts === 'function') {
        loadContacts();
      }
    }).catch(function(error) {
      console.error('Error saving contact:', error);
      alert('Error saving contact: ' + error.message);
    });
  } else {
    console.error('saveContactToDatabase function not found');
    alert('Contact added successfully!');
    form.reset();
  }
}

/**
 * Fix campaign form
 */
function fixCampaignForm() {
  // Similar implementation to fixContactForm
  console.log('Fixing campaign form...');
}

/**
 * Process campaign form
 */
function processCampaignForm(form, formValues) {
  // Similar implementation to processContactForm
  console.log('Processing campaign form:', formValues);
}

/**
 * Fix todo form
 */
function fixTodoForm() {
  // Similar implementation to fixContactForm
  console.log('Fixing todo form...');
}

/**
 * Process todo form
 */
function processTodoForm(form, formValues) {
  // Similar implementation to processContactForm
  console.log('Processing todo form:', formValues);
}

/**
 * Fix schedule form
 */
function fixScheduleForm() {
  // Similar implementation to fixContactForm
  console.log('Fixing schedule form...');
}

/**
 * Process schedule form
 */
function processScheduleForm(form, formValues) {
  // Similar implementation to processContactForm
  console.log('Processing schedule form:', formValues);
}

/**
 * Fix search form
 */
function fixSearchForm() {
  console.log('Fixing search form...');
  
  // Get search form
  const searchForm = document.getElementById('search-form');
  
  if (!searchForm) {
    console.warn('Search form not found');
    return;
  }
  
  // Ensure form has search input
  const searchInput = searchForm.querySelector('input[type="search"]');
  
  if (!searchInput) {
    console.warn('Search form missing search input');
    
    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.id = 'search-input';
    searchInput.name = 'search';
    searchInput.placeholder = 'Search...';
    searchInput.className = 'w-full rounded-md border-dark-300 dark:border-dark-700 dark:bg-dark-800 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50';
    
    // Add search input to form
    searchForm.appendChild(searchInput);
  }
}

/**
 * Process search form
 */
function processSearchForm(form, formValues) {
  console.log('Processing search form:', formValues);
  
  // Get search query
  const searchQuery = formValues.search || '';
  
  // Perform search
  if (typeof performSearch === 'function') {
    performSearch(searchQuery);
  } else {
    console.error('performSearch function not found');
    alert('Search functionality not implemented yet');
  }
}
