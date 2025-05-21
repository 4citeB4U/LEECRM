/**
 * Main JavaScript file for Agent Lee CRM
 * Initializes all systems and sets up event listeners
 */

// Initialize the CRM system
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing Agent Lee CRM...');

  // Initialize the theme
  initializeTheme();

  // Initialize the navigation
  initializeNavigation();

  // Initialize form functionality
  initializeForms();

  // Initialize button functionality
  initializeButtons();

  // Initialize the AI features
  if (window.LeewayAIFeatures) {
    window.LeewayAIFeatures.init();
  }

  // Initialize the analytics system
  if (typeof initializeAnalyticsSystem === 'function') {
    initializeAnalyticsSystem();
  }

  // Initialize the advanced scheduling system
  if (typeof initializeAdvancedScheduling === 'function') {
    initializeAdvancedScheduling();
  }

  // Initialize the email campaign scheduler
  if (window.EmailCampaignScheduler) {
    window.EmailCampaignScheduler.initialize();
  }

  // Initialize the Agent Lee Card (only once)
  if (window.AgentLeeCard) {
    console.log('Preparing Agent Lee Card...');

    // Initialize a single Agent Lee card (the initialization function now handles duplicates)
    window.AgentLeeCard.initialize();

    // Make Agent Lee introduce himself after a short delay
    setTimeout(() => {
      window.AgentLeeCard.show();
      window.AgentLeeCard.addMessage("Hello! I'm Agent Lee, your AI CRM assistant. I'm ready to help you with your tasks today. Just click on me if you need assistance!", 'agent');
    }, 1500);
  }

  // Initialize the voice system
  initializeVoiceSystem();

  // Initialize Google Maps integration
  initializeGoogleMapsIntegration();
});

// Initialize the theme
function initializeTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
  const html = document.documentElement;

  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }

  // Toggle theme function
  function toggleTheme() {
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }

  // Add event listeners to theme toggle buttons
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', toggleTheme);
  }
}

// Initialize the navigation
function initializeNavigation() {
  const tabs = document.querySelectorAll('[data-tab]');
  const tabContents = document.querySelectorAll('[data-tab-content]');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileSidebar = document.getElementById('mobile-sidebar');
  const closeSidebar = document.getElementById('close-sidebar');
  const mobileBackdrop = document.getElementById('mobile-backdrop');

  // Tab navigation
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;

      // Update active tab
      tabs.forEach(t => {
        if (t.dataset.tab === tabName) {
          t.classList.add('active-tab');
        } else {
          t.classList.remove('active-tab');
        }
      });

      // Show active tab content
      tabContents.forEach(content => {
        if (content.dataset.tabContent === tabName) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });

      // Close mobile sidebar if open
      if (mobileSidebar && mobileSidebar.classList.contains('translate-x-0')) {
        mobileSidebar.classList.remove('translate-x-0');
        mobileSidebar.classList.add('-translate-x-full');

        if (mobileBackdrop) {
          mobileBackdrop.classList.add('hidden');
        }
      }

      // Save active tab to localStorage
      localStorage.setItem('activeTab', tabName);
    });
  });

  // Mobile menu
  if (mobileMenuBtn && mobileSidebar && mobileBackdrop) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileSidebar.classList.remove('-translate-x-full');
      mobileSidebar.classList.add('translate-x-0');
      mobileBackdrop.classList.remove('hidden');
    });

    if (closeSidebar) {
      closeSidebar.addEventListener('click', () => {
        mobileSidebar.classList.remove('translate-x-0');
        mobileSidebar.classList.add('-translate-x-full');
        mobileBackdrop.classList.add('hidden');
      });
    }

    mobileBackdrop.addEventListener('click', () => {
      mobileSidebar.classList.remove('translate-x-0');
      mobileSidebar.classList.add('-translate-x-full');
      mobileBackdrop.classList.add('hidden');
    });
  }

  // Restore active tab from localStorage
  const activeTab = localStorage.getItem('activeTab');
  if (activeTab) {
    const tabToActivate = document.querySelector(`[data-tab="${activeTab}"]`);
    if (tabToActivate) {
      tabToActivate.click();
    }
  } else {
    // Default to first tab
    const firstTab = document.querySelector('[data-tab]');
    if (firstTab) {
      firstTab.click();
    }
  }
}

// Initialize form functionality
function initializeForms() {
  console.log('Initializing forms...');

  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const phoneInput = document.getElementById('contact-phone');
      const companyInput = document.getElementById('contact-company');
      const addressInput = document.getElementById('contact-address');

      if (!nameInput || !emailInput || !phoneInput) {
        alert('Please fill in all required fields');
        return;
      }

      const contact = {
        id: 'contact_' + Date.now(),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        company: companyInput ? companyInput.value.trim() : '',
        address: addressInput ? addressInput.value.trim() : '',
        createdAt: new Date().toISOString()
      };

      // Save to IndexedDB
      saveContactToDatabase(contact).then(() => {
        // Close modal
        const modal = document.getElementById('contact-modal');
        if (modal) {
          modal.classList.add('hidden');
        }

        // Reset form
        contactForm.reset();

        // Show success message
        alert('Contact added successfully!');

        // Refresh contacts list
        loadContacts();
      }).catch(error => {
        console.error('Error saving contact:', error);
        alert('Error saving contact. Please try again.');
      });
    });
  }

  // Campaign form
  const campaignForm = document.getElementById('campaign-form');
  if (campaignForm) {
    campaignForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const nameInput = document.getElementById('campaign-name');
      const subjectInput = document.getElementById('email-subject');
      const templateSelect = document.getElementById('email-template');

      if (!nameInput || !subjectInput || !templateSelect) {
        alert('Please fill in all required fields');
        return;
      }

      const campaign = {
        id: 'campaign_' + Date.now(),
        name: nameInput.value.trim(),
        subject: subjectInput.value.trim(),
        template: templateSelect.value,
        status: 'draft',
        createdAt: new Date().toISOString()
      };

      // Save to IndexedDB
      saveCampaignToDatabase(campaign).then(() => {
        // Close modal
        const modal = document.getElementById('create-campaign-modal');
        if (modal) {
          modal.classList.add('hidden');
        }

        // Reset form
        campaignForm.reset();

        // Show success message
        alert('Campaign created successfully!');

        // Refresh campaigns list
        if (window.EmailCampaignScheduler) {
          window.EmailCampaignScheduler.loadEmailCampaigns();
        }
      }).catch(error => {
        console.error('Error saving campaign:', error);
        alert('Error saving campaign. Please try again.');
      });
    });
  }

  // Schedule form
  const scheduleForm = document.getElementById('schedule-form');
  if (scheduleForm) {
    scheduleForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const titleInput = document.getElementById('schedule-title');
      const typeSelect = document.getElementById('schedule-type');
      const dateInput = document.getElementById('schedule-date');
      const timeInput = document.getElementById('schedule-time');

      if (!titleInput || !typeSelect || !dateInput || !timeInput) {
        alert('Please fill in all required fields');
        return;
      }

      const schedule = {
        id: 'schedule_' + Date.now(),
        title: titleInput.value.trim(),
        type: typeSelect.value,
        date: dateInput.value,
        time: timeInput.value,
        completed: false,
        createdAt: new Date().toISOString()
      };

      // Save to IndexedDB
      saveScheduleToDatabase(schedule).then(() => {
        // Close modal
        const modal = document.getElementById('add-schedule-modal');
        if (modal) {
          modal.classList.add('hidden');
        }

        // Reset form
        scheduleForm.reset();

        // Show success message
        alert('Schedule created successfully!');

        // Refresh schedules list
        loadSchedules();
      }).catch(error => {
        console.error('Error saving schedule:', error);
        alert('Error saving schedule. Please try again.');
      });
    });
  }

  // To-Do form
  const todoForm = document.getElementById('todo-form');
  if (todoForm) {
    todoForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const titleInput = document.getElementById('todo-title');
      const descriptionInput = document.getElementById('todo-description');
      const prioritySelect = document.getElementById('todo-priority');
      const dueDateInput = document.getElementById('todo-due-date');

      if (!titleInput) {
        alert('Please enter a title for the to-do');
        return;
      }

      const todo = {
        id: 'todo_' + Date.now(),
        title: titleInput.value.trim(),
        description: descriptionInput ? descriptionInput.value.trim() : '',
        priority: prioritySelect ? prioritySelect.value : 'medium',
        dueDate: dueDateInput && dueDateInput.value ? dueDateInput.value : null,
        completed: false,
        createdAt: new Date().toISOString()
      };

      // Save to IndexedDB
      saveTodoToDatabase(todo).then(() => {
        // Close modal
        const modal = document.getElementById('add-todo-modal');
        if (modal) {
          modal.classList.add('hidden');
        }

        // Reset form
        todoForm.reset();

        // Show success message
        alert('To-Do created successfully!');

        // Refresh to-do list
        if (window.LeewayAIFeatures) {
          window.LeewayAIFeatures.loadToDos();
        }
      }).catch(error => {
        console.error('Error saving to-do:', error);
        alert('Error saving to-do. Please try again.');
      });
    });
  }
}

// Initialize button functionality
function initializeButtons() {
  console.log('Initializing buttons...');

  // Add event listeners to all buttons
  document.querySelectorAll('button').forEach(button => {
    if (!button.hasAttribute('data-initialized')) {
      // Add a click sound effect
      button.addEventListener('click', function() {
        playClickSound();
      });

      // Mark as initialized
      button.setAttribute('data-initialized', 'true');
    }
  });

  // Add Contact button
  const addContactBtn = document.getElementById('add-contact');
  if (addContactBtn) {
    addContactBtn.addEventListener('click', function() {
      const modal = document.getElementById('contact-modal');
      if (modal) {
        modal.classList.remove('hidden');
      }
    });
  }

  // Close Contact Modal button
  const closeContactModalBtn = document.getElementById('close-contact-modal');
  if (closeContactModalBtn) {
    closeContactModalBtn.addEventListener('click', function() {
      const modal = document.getElementById('contact-modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    });
  }

  // Add Schedule button
  const addScheduleBtn = document.getElementById('add-schedule-btn');
  if (addScheduleBtn) {
    addScheduleBtn.addEventListener('click', function() {
      const modal = document.getElementById('add-schedule-modal');
      if (modal) {
        modal.classList.remove('hidden');
      }
    });
  }

  // Close Schedule Modal button
  const closeScheduleModalBtn = document.getElementById('close-schedule-modal');
  if (closeScheduleModalBtn) {
    closeScheduleModalBtn.addEventListener('click', function() {
      const modal = document.getElementById('add-schedule-modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    });
  }

  // Add To-Do button
  const addTodoBtn = document.getElementById('add-todo-btn');
  if (addTodoBtn) {
    addTodoBtn.addEventListener('click', function() {
      const modal = document.getElementById('add-todo-modal');
      if (modal) {
        modal.classList.remove('hidden');
      }
    });
  }

  // Close To-Do Modal button
  const closeTodoModalBtn = document.getElementById('close-todo-modal');
  if (closeTodoModalBtn) {
    closeTodoModalBtn.addEventListener('click', function() {
      const modal = document.getElementById('add-todo-modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    });
  }

  // Create Campaign button
  const createCampaignBtn = document.getElementById('create-campaign-btn');
  if (createCampaignBtn) {
    createCampaignBtn.addEventListener('click', function() {
      const modal = document.getElementById('create-campaign-modal');
      if (modal) {
        modal.classList.remove('hidden');
      }
    });
  }

  // Close Campaign Modal button
  const closeCampaignModalBtn = document.getElementById('close-campaign-modal');
  if (closeCampaignModalBtn) {
    closeCampaignModalBtn.addEventListener('click', function() {
      const modal = document.getElementById('create-campaign-modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    });
  }
}

// Initialize Google Maps integration
function initializeGoogleMapsIntegration() {
  console.log('Initializing Google Maps integration...');

  // Company address map
  const companyAddressMap = document.getElementById('company-address-map');
  if (companyAddressMap) {
    // Company address (Leonard Lee's office)
    const companyAddress = "414 Main Street, Milwaukee, WI 53202";

    // Initialize map
    const map = new google.maps.Map(companyAddressMap, {
      center: { lat: 43.0389, lng: -87.9065 }, // Default to Milwaukee
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Geocode the address
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: companyAddress }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        const location = results[0].geometry.location;

        // Center map on address
        map.setCenter(location);

        // Add marker
        const marker = new google.maps.Marker({
          position: location,
          map: map,
          title: "Leonard Lee's Office",
          animation: google.maps.Animation.DROP
        });

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-medium text-lg">Leonard Lee's Office</h3>
              <p>${companyAddress}</p>
              <p><a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(companyAddress)}" target="_blank" class="text-blue-500 hover:underline">Get Directions</a></p>
            </div>
          `
        });

        // Open info window on click
        marker.addListener('click', function() {
          infoWindow.open(map, marker);
        });

        // Open info window by default
        infoWindow.open(map, marker);
      }
    });

    // Add a "Get Directions" link below the map
    const mapContainer = companyAddressMap.parentNode;
    if (mapContainer) {
      const directionsLink = document.createElement('a');
      directionsLink.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(companyAddress)}`;
      directionsLink.target = '_blank';
      directionsLink.className = 'block mt-2 text-center text-primary hover:underline';
      directionsLink.textContent = 'Get Directions to Leonard Lee\'s Office';
      mapContainer.appendChild(directionsLink);
    }
  }

  // Initialize business card map when the tab is shown
  document.querySelectorAll('[data-tab="business-card"]').forEach(tab => {
    tab.addEventListener('click', initializeBusinessCardMap);
  });
}

// Initialize the business card map
function initializeBusinessCardMap() {
  console.log('Initializing business card map...');

  const businessCardMap = document.getElementById('business-card-map');
  if (!businessCardMap) return;

  // Leonard Lee's company address
  const companyAddress = "414 Main Street, Milwaukee, WI 53202";

  // Check if map is already initialized
  if (businessCardMap.dataset.initialized === 'true') {
    console.log('Business card map already initialized');
    return;
  }

  // Initialize map with Milwaukee coordinates
  const map = new google.maps.Map(businessCardMap, {
    center: { lat: 43.0389, lng: -87.9065 }, // Milwaukee
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false
  });

  // Geocode the address
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: companyAddress }, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK && results[0]) {
      const location = results[0].geometry.location;

      // Center map on address
      map.setCenter(location);

      // Add marker
      const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: "Lee Music Distribution",
        animation: google.maps.Animation.DROP
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-medium text-lg">Lee Music Distribution</h3>
            <p>${companyAddress}</p>
            <p><a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(companyAddress)}" target="_blank" class="text-blue-500 hover:underline">Get Directions</a></p>
          </div>
        `
      });

      // Open info window on click
      marker.addListener('click', function() {
        infoWindow.open(map, marker);
      });

      // Open info window by default
      infoWindow.open(map, marker);
    }
  });

  // Mark as initialized
  businessCardMap.dataset.initialized = 'true';
}

// Helper functions for database operations
async function saveContactToDatabase(contact) {
  const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
  let contacts = await idbKeyval.get('contacts', dbPromise) || [];
  contacts.push(contact);
  return idbKeyval.set('contacts', contacts, dbPromise);
}

async function saveCampaignToDatabase(campaign) {
  const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
  let campaigns = await idbKeyval.get('email_campaigns', dbPromise) || [];
  campaigns.push(campaign);
  return idbKeyval.set('email_campaigns', campaigns, dbPromise);
}

async function saveScheduleToDatabase(schedule) {
  const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
  let schedules = await idbKeyval.get('schedules', dbPromise) || [];
  schedules.push(schedule);
  return idbKeyval.set('schedules', schedules, dbPromise);
}

async function saveTodoToDatabase(todo) {
  const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
  let todos = await idbKeyval.get('todos', dbPromise) || [];
  todos.push(todo);
  return idbKeyval.set('todos', todos, dbPromise);
}

async function loadContacts() {
  try {
    const contactsList = document.getElementById('contacts-list');
    if (!contactsList) return;

    // Get contacts from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let contacts = await idbKeyval.get('contacts', dbPromise) || [];

    // Clear list
    contactsList.innerHTML = '';

    if (contacts.length === 0) {
      contactsList.innerHTML = `
        <div class="text-center p-6 text-dark-500 dark:text-dark-400">
          No contacts found. Add a new contact to get started.
        </div>
      `;
      return;
    }

    // Sort contacts by name
    contacts.sort((a, b) => a.name.localeCompare(b.name));

    // Render contacts
    contacts.forEach(contact => {
      const contactItem = document.createElement('div');
      contactItem.className = 'border-b border-dark-200 dark:border-dark-600 hover:bg-dark-50 dark:hover:bg-dark-700/50 p-3';

      contactItem.innerHTML = `
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-medium text-dark-900 dark:text-white">${contact.name}</h4>
            <p class="text-sm text-dark-500 dark:text-dark-400">${contact.email}</p>
            <p class="text-sm text-dark-500 dark:text-dark-400">${contact.phone}</p>
          </div>
          <div>
            <button type="button" class="text-primary hover:text-primary-dark p-1" onclick="editContact('${contact.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button type="button" class="text-red-500 hover:text-red-600 p-1" onclick="deleteContact('${contact.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      `;

      contactsList.appendChild(contactItem);
    });
  } catch (error) {
    console.error('Error loading contacts:', error);
  }
}

async function loadSchedules() {
  try {
    const schedulesList = document.getElementById('schedules-list');
    if (!schedulesList) return;

    // Get schedules from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let schedules = await idbKeyval.get('schedules', dbPromise) || [];

    // Clear list
    schedulesList.innerHTML = '';

    if (schedules.length === 0) {
      schedulesList.innerHTML = `
        <div class="text-center p-6 text-dark-500 dark:text-dark-400">
          No schedules found. Add a new schedule to get started.
        </div>
      `;
      return;
    }

    // Sort schedules by date and time
    schedules.sort((a, b) => {
      const dateA = new Date(a.date + 'T' + a.time);
      const dateB = new Date(b.date + 'T' + b.time);
      return dateA - dateB;
    });

    // Render schedules
    schedules.forEach(schedule => {
      const scheduleItem = document.createElement('div');
      scheduleItem.className = 'border-b border-dark-200 dark:border-dark-600 hover:bg-dark-50 dark:hover:bg-dark-700/50 p-3';

      // Format date and time
      const scheduleDate = new Date(schedule.date + 'T' + schedule.time);
      const formattedDateTime = scheduleDate.toLocaleString();

      scheduleItem.innerHTML = `
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-medium text-dark-900 dark:text-white">${schedule.title}</h4>
            <p class="text-sm text-dark-500 dark:text-dark-400">${schedule.type} - ${formattedDateTime}</p>
          </div>
          <div>
            <button type="button" class="text-primary hover:text-primary-dark p-1" onclick="editSchedule('${schedule.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button type="button" class="text-red-500 hover:text-red-600 p-1" onclick="deleteSchedule('${schedule.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      `;

      schedulesList.appendChild(scheduleItem);
    });
  } catch (error) {
    console.error('Error loading schedules:', error);
  }
}

// Play a click sound when buttons are pressed
function playClickSound() {
  const audio = new Audio('data:audio/mp3;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMA//uQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAABAAADQgD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAAA5TEFNRTMuMTAwAc0AAAAAAAAAABSAJAJAQgAAgAAAA0L2YLwxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uAxAAAApEXTlUEAAhTI2qNPMAAAAABPgAAAwAAA+gAAAJMQU1FMy4xMDADQAAAAAAAAAAAFIAkAkBCAACAAAADQvZgvDEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=');
  audio.volume = 0.2;
  audio.play().catch(e => console.log('Error playing sound:', e));
}

// Initialize the voice system
function initializeVoiceSystem() {
  // Create the LeewayTech namespace if it doesn't exist
  window.LeewayTech = window.LeewayTech || {};

  // Create the Voice object
  window.LeewayTech.Voice = {
    recognition: null,
    isListening: false,
    callbacks: {},

    // Initialize speech recognition
    initDictation: function(callbacks) {
      // Store callbacks
      this.callbacks = callbacks || {};

      // Check if speech recognition is supported
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.error('Speech recognition not supported');
        if (this.callbacks.onError) {
          this.callbacks.onError('Speech recognition not supported');
        }
        return false;
      }

      // Create speech recognition object
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();

      // Configure recognition
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      // Set up event handlers
      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.callbacks.onStart) {
          this.callbacks.onStart();
        }
      };

      this.recognition.onresult = (event) => {
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

        if (interimTranscript && this.callbacks.onResult) {
          this.callbacks.onResult(interimTranscript);
        }

        if (finalTranscript && this.callbacks.onFinalResult) {
          this.callbacks.onFinalResult(finalTranscript);
        }
      };

      this.recognition.onerror = (event) => {
        if (this.callbacks.onError) {
          this.callbacks.onError(event.error);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.callbacks.onEnd) {
          this.callbacks.onEnd();
        }
      };

      return true;
    },

    // Start dictation
    startDictation: function() {
      if (this.recognition) {
        try {
          this.recognition.start();
        } catch (error) {
          console.error('Error starting dictation:', error);
          if (this.callbacks.onError) {
            this.callbacks.onError(error.message);
          }
        }
      } else {
        console.error('Speech recognition not initialized');
        if (this.callbacks.onError) {
          this.callbacks.onError('Speech recognition not initialized');
        }
      }
    },

    // Stop dictation
    stopDictation: function() {
      if (this.recognition && this.isListening) {
        this.recognition.stop();
      }
    }
  };

  console.log('Voice system initialized');
}

// Global functions for contact management
window.editContact = async function(contactId) {
  try {
    // Get contacts from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let contacts = await idbKeyval.get('contacts', dbPromise) || [];

    // Find the contact
    const contact = contacts.find(contact => contact.id === contactId);

    if (!contact) {
      console.error('Contact not found:', contactId);
      return;
    }

    // Open the modal
    const modal = document.getElementById('contact-modal');
    if (!modal) {
      console.error('Modal not found');
      return;
    }

    // Update modal title
    const modalTitle = document.getElementById('contact-modal-title');
    if (modalTitle) {
      modalTitle.textContent = 'Edit Contact';
    }

    // Fill form with contact data
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const phoneInput = document.getElementById('contact-phone');
    const companyInput = document.getElementById('contact-company');
    const addressInput = document.getElementById('contact-address');

    if (nameInput) nameInput.value = contact.name;
    if (emailInput) emailInput.value = contact.email;
    if (phoneInput) phoneInput.value = contact.phone;
    if (companyInput) companyInput.value = contact.company || '';
    if (addressInput) addressInput.value = contact.address || '';

    // Store the contact ID in a data attribute
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.dataset.contactId = contactId;

      // Update form submission handler
      contactForm.onsubmit = function(e) {
        e.preventDefault();

        // Get updated contact data
        const updatedContact = {
          ...contact,
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          phone: phoneInput.value.trim(),
          company: companyInput ? companyInput.value.trim() : '',
          address: addressInput ? addressInput.value.trim() : ''
        };

        // Update contact in IndexedDB
        const contactIndex = contacts.findIndex(c => c.id === contactId);
        if (contactIndex !== -1) {
          contacts[contactIndex] = updatedContact;

          idbKeyval.set('contacts', contacts, dbPromise).then(() => {
            // Close modal
            modal.classList.add('hidden');

            // Reset form
            contactForm.reset();

            // Reset form submission handler
            contactForm.onsubmit = null;

            // Reset modal title
            if (modalTitle) {
              modalTitle.textContent = 'Add Contact';
            }

            // Show success message
            alert('Contact updated successfully!');

            // Refresh contacts list
            loadContacts();
          }).catch(error => {
            console.error('Error updating contact:', error);
            alert('Error updating contact. Please try again.');
          });
        }
      };
    }

    // Show the modal
    modal.classList.remove('hidden');
  } catch (error) {
    console.error('Error editing contact:', error);
  }
};

window.deleteContact = async function(contactId) {
  try {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    // Get contacts from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let contacts = await idbKeyval.get('contacts', dbPromise) || [];

    // Find and remove the contact
    const contactIndex = contacts.findIndex(contact => contact.id === contactId);

    if (contactIndex !== -1) {
      contacts.splice(contactIndex, 1);

      // Save to IndexedDB
      await idbKeyval.set('contacts', contacts, dbPromise);

      // Show success message
      alert('Contact deleted successfully!');

      // Refresh contacts list
      loadContacts();
    }
  } catch (error) {
    console.error('Error deleting contact:', error);
  }
};

// Global functions for schedule management
window.editSchedule = async function(scheduleId) {
  try {
    // Get schedules from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let schedules = await idbKeyval.get('schedules', dbPromise) || [];

    // Find the schedule
    const schedule = schedules.find(schedule => schedule.id === scheduleId);

    if (!schedule) {
      console.error('Schedule not found:', scheduleId);
      return;
    }

    // Open the modal
    const modal = document.getElementById('add-schedule-modal');
    if (!modal) {
      console.error('Modal not found');
      return;
    }

    // Update modal title
    const modalTitle = document.getElementById('schedule-modal-title');
    if (modalTitle) {
      modalTitle.textContent = 'Edit Schedule';
    }

    // Fill form with schedule data
    const titleInput = document.getElementById('schedule-title');
    const typeSelect = document.getElementById('schedule-type');
    const dateInput = document.getElementById('schedule-date');
    const timeInput = document.getElementById('schedule-time');
    const contactInput = document.getElementById('schedule-contact');
    const notesInput = document.getElementById('schedule-notes');
    const prioritySelect = document.getElementById('schedule-priority');

    if (titleInput) titleInput.value = schedule.title;
    if (typeSelect) typeSelect.value = schedule.type;
    if (dateInput) dateInput.value = schedule.date;
    if (timeInput) timeInput.value = schedule.time;
    if (contactInput) contactInput.value = schedule.contact || '';
    if (notesInput) notesInput.value = schedule.notes || '';
    if (prioritySelect) prioritySelect.value = schedule.priority || 'Medium';

    // Store the schedule ID in a data attribute
    const scheduleForm = document.getElementById('schedule-form');
    if (scheduleForm) {
      scheduleForm.dataset.scheduleId = scheduleId;

      // Update form submission handler
      scheduleForm.onsubmit = function(e) {
        e.preventDefault();

        // Get updated schedule data
        const updatedSchedule = {
          ...schedule,
          title: titleInput.value.trim(),
          type: typeSelect.value,
          date: dateInput.value,
          time: timeInput.value,
          contact: contactInput ? contactInput.value.trim() : '',
          notes: notesInput ? notesInput.value.trim() : '',
          priority: prioritySelect ? prioritySelect.value : 'Medium'
        };

        // Update schedule in IndexedDB
        const scheduleIndex = schedules.findIndex(s => s.id === scheduleId);
        if (scheduleIndex !== -1) {
          schedules[scheduleIndex] = updatedSchedule;

          idbKeyval.set('schedules', schedules, dbPromise).then(() => {
            // Close modal
            modal.classList.add('hidden');

            // Reset form
            scheduleForm.reset();

            // Reset form submission handler
            scheduleForm.onsubmit = null;

            // Reset modal title
            if (modalTitle) {
              modalTitle.textContent = 'Add Schedule';
            }

            // Show success message
            alert('Schedule updated successfully!');

            // Refresh schedules list
            loadSchedules();
          }).catch(error => {
            console.error('Error updating schedule:', error);
            alert('Error updating schedule. Please try again.');
          });
        }
      };
    }

    // Show the modal
    modal.classList.remove('hidden');
  } catch (error) {
    console.error('Error editing schedule:', error);
  }
};

window.deleteSchedule = async function(scheduleId) {
  try {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this schedule?')) {
      return;
    }

    // Get schedules from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let schedules = await idbKeyval.get('schedules', dbPromise) || [];

    // Find and remove the schedule
    const scheduleIndex = schedules.findIndex(schedule => schedule.id === scheduleId);

    if (scheduleIndex !== -1) {
      schedules.splice(scheduleIndex, 1);

      // Save to IndexedDB
      await idbKeyval.set('schedules', schedules, dbPromise);

      // Show success message
      alert('Schedule deleted successfully!');

      // Refresh schedules list
      loadSchedules();
    }
  } catch (error) {
    console.error('Error deleting schedule:', error);
  }
};
