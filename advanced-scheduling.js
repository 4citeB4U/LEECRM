/**
 * Advanced Scheduling System for Agent Lee CRM
 * Provides advanced scheduling, strategic routing, and appointment setting based on SEO and Analytics
 */

// Initialize the advanced scheduling system
function initializeAdvancedScheduling() {
  console.log('Initializing Advanced Scheduling System...');

  // Set up event listeners for scheduling UI
  setupSchedulingEventListeners();

  // Load existing schedules from IndexedDB
  loadSchedules();

  // Initialize routing planner
  initializeRoutingPlanner();
}

// Set up event listeners for scheduling UI
function setupSchedulingEventListeners() {
  // Add schedule button
  const addScheduleBtn = document.getElementById('add-schedule-btn');
  if (addScheduleBtn) {
    addScheduleBtn.addEventListener('click', function() {
      const modal = document.getElementById('add-schedule-modal');
      if (modal) {
        modal.classList.remove('hidden');

        // Set default date to tomorrow
        const scheduleDateInput = document.getElementById('schedule-date');
        if (scheduleDateInput) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const year = tomorrow.getFullYear();
          const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
          const day = String(tomorrow.getDate()).padStart(2, '0');

          scheduleDateInput.value = `${year}-${month}-${day}`;
        }
      }
    });
  }

  // Schedule form submission
  const scheduleForm = document.getElementById('schedule-form');
  if (scheduleForm) {
    scheduleForm.addEventListener('submit', function(e) {
      e.preventDefault();
      saveSchedule();
    });
  }

  // Schedule search
  const scheduleSearch = document.getElementById('schedule-search');
  if (scheduleSearch) {
    scheduleSearch.addEventListener('input', function() {
      filterSchedules();
    });
  }

  // Schedule filter
  const scheduleFilter = document.getElementById('schedule-filter');
  if (scheduleFilter) {
    scheduleFilter.addEventListener('change', function() {
      filterSchedules();
    });
  }

  // Modal close buttons
  const closeScheduleModal = document.getElementById('close-schedule-modal');
  const cancelScheduleBtn = document.getElementById('cancel-schedule-btn');
  const scheduleModalBackdrop = document.getElementById('schedule-modal-backdrop');

  [closeScheduleModal, cancelScheduleBtn, scheduleModalBackdrop].forEach(element => {
    if (element) {
      element.addEventListener('click', function() {
        const modal = document.getElementById('add-schedule-modal');
        if (modal) {
          modal.classList.add('hidden');
        }
      });
    }
  });

  // Routing plan button
  const createRoutingPlanBtn = document.getElementById('create-routing-plan-btn');
  if (createRoutingPlanBtn) {
    createRoutingPlanBtn.addEventListener('click', function() {
      createRoutingPlan();
    });
  }

  // Bulk scheduling button
  const bulkScheduleBtn = document.getElementById('bulk-schedule-btn');
  if (bulkScheduleBtn) {
    bulkScheduleBtn.addEventListener('click', function() {
      const modal = document.getElementById('bulk-schedule-modal');
      if (modal) {
        modal.classList.remove('hidden');
      }
    });
  }

  // Bulk schedule form
  const bulkScheduleForm = document.getElementById('bulk-schedule-form');
  if (bulkScheduleForm) {
    bulkScheduleForm.addEventListener('submit', function(e) {
      e.preventDefault();
      saveBulkSchedule();
    });
  }

  // Bulk schedule modal close buttons
  const closeBulkModal = document.getElementById('close-bulk-modal');
  const cancelBulkBtn = document.getElementById('cancel-bulk-btn');
  const bulkModalBackdrop = document.getElementById('bulk-modal-backdrop');

  [closeBulkModal, cancelBulkBtn, bulkModalBackdrop].forEach(element => {
    if (element) {
      element.addEventListener('click', function() {
        const modal = document.getElementById('bulk-schedule-modal');
        if (modal) {
          modal.classList.add('hidden');
        }
      });
    }
  });

  // Email campaign scheduling button
  const scheduleEmailBtn = document.getElementById('schedule-email-btn');
  if (scheduleEmailBtn) {
    scheduleEmailBtn.addEventListener('click', function() {
      const modal = document.getElementById('schedule-email-modal');
      if (modal) {
        modal.classList.remove('hidden');
      }
    });
  }

  // Email schedule form
  const emailScheduleForm = document.getElementById('email-schedule-form');
  if (emailScheduleForm) {
    emailScheduleForm.addEventListener('submit', function(e) {
      e.preventDefault();
      saveEmailSchedule();
    });
  }

  // Email schedule modal close buttons
  const closeEmailModal = document.getElementById('close-email-modal');
  const cancelEmailBtn = document.getElementById('cancel-email-btn');
  const emailModalBackdrop = document.getElementById('email-modal-backdrop');

  [closeEmailModal, cancelEmailBtn, emailModalBackdrop].forEach(element => {
    if (element) {
      element.addEventListener('click', function() {
        const modal = document.getElementById('schedule-email-modal');
        if (modal) {
          modal.classList.add('hidden');
        }
      });
    }
  });
}

// Save a schedule
async function saveSchedule() {
  try {
    const titleInput = document.getElementById('schedule-title');
    const typeSelect = document.getElementById('schedule-type');
    const dateInput = document.getElementById('schedule-date');
    const timeInput = document.getElementById('schedule-time');
    const contactInput = document.getElementById('schedule-contact');
    const notesInput = document.getElementById('schedule-notes');
    const prioritySelect = document.getElementById('schedule-priority');

    if (!titleInput || !typeSelect || !dateInput || !timeInput) {
      console.error('Missing required form elements');
      return;
    }

    const title = titleInput.value.trim();
    const type = typeSelect.value;
    const date = dateInput.value;
    const time = timeInput.value;
    const contact = contactInput ? contactInput.value.trim() : '';
    const notes = notesInput ? notesInput.value.trim() : '';
    const priority = prioritySelect ? prioritySelect.value : 'Medium';

    if (!title || !date || !time) {
      alert('Please fill in all required fields');
      return;
    }

    // Create schedule object
    const schedule = {
      id: 'schedule_' + Date.now(),
      title,
      type,
      date,
      time,
      contact,
      notes,
      priority,
      completed: false,
      createdAt: new Date().toISOString()
    };

    // Save to IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let schedules = await idbKeyval.get('schedules', dbPromise) || [];
    schedules.push(schedule);
    await idbKeyval.set('schedules', schedules, dbPromise);

    // Close modal
    const modal = document.getElementById('add-schedule-modal');
    if (modal) {
      modal.classList.add('hidden');
    }

    // Reset form
    if (titleInput) titleInput.value = '';
    if (notesInput) notesInput.value = '';
    if (contactInput) contactInput.value = '';

    // Reload schedules
    await loadSchedules();

    // Add to timeline
    if (window.LeewayAIFeatures && typeof window.LeewayAIFeatures.addToTimeline === 'function') {
      await window.LeewayAIFeatures.addToTimeline({
        type: type.toLowerCase(),
        title: 'Scheduled: ' + title,
        description: `Scheduled a ${priority} priority ${type.toLowerCase()} for ${new Date(date + 'T' + time).toLocaleString()}${contact ? ' with ' + contact : ''}.`,
        related: contact || 'Scheduling',
        subtype: 'Schedule Created'
      });
    }

    // Show success message
    alert('Schedule created successfully!');
  } catch (error) {
    console.error('Error saving schedule:', error);
  }
}

// Load schedules from IndexedDB
async function loadSchedules() {
  try {
    const schedulesList = document.getElementById('schedules-list');
    if (!schedulesList) return;

    // Show loading state
    schedulesList.innerHTML = `
      <div class="flex justify-center items-center p-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    `;

    // Get schedules from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let schedules = await idbKeyval.get('schedules', dbPromise) || [];

    if (schedules.length === 0) {
      schedulesList.innerHTML = `
        <div class="text-center p-6 text-dark-500 dark:text-dark-400">
          No schedules found. Create a new schedule to get started.
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
    renderSchedules(schedules);
  } catch (error) {
    console.error('Error loading schedules:', error);
  }
}

// Render schedules in the UI
function renderSchedules(schedules) {
  const schedulesList = document.getElementById('schedules-list');
  if (!schedulesList) return;

  schedulesList.innerHTML = '';

  // Group schedules by date
  const groupedSchedules = {};

  schedules.forEach(schedule => {
    const date = schedule.date;
    if (!groupedSchedules[date]) {
      groupedSchedules[date] = [];
    }
    groupedSchedules[date].push(schedule);
  });

  // Sort dates
  const sortedDates = Object.keys(groupedSchedules).sort();

  // Render each date group
  sortedDates.forEach(date => {
    const dateSchedules = groupedSchedules[date];

    // Create date header
    const dateHeader = document.createElement('div');
    dateHeader.className = 'bg-dark-100 dark:bg-dark-700 px-4 py-2 font-medium text-dark-700 dark:text-dark-300 sticky top-0 z-10';

    // Format date
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    dateHeader.textContent = formattedDate;
    schedulesList.appendChild(dateHeader);

    // Render schedules for this date
    dateSchedules.forEach(schedule => {
      const scheduleItem = createScheduleItem(schedule);
      schedulesList.appendChild(scheduleItem);
    });
  });
}

// Create a schedule item element
function createScheduleItem(schedule) {
  const scheduleItem = document.createElement('div');
  scheduleItem.className = 'border-b border-dark-200 dark:border-dark-600 hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-colors';
  scheduleItem.dataset.scheduleId = schedule.id;

  // Get color based on schedule type
  const typeColors = {
    'Meeting': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'Call': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'Email': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'Visit': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    'Task': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
  };

  const typeColor = typeColors[schedule.type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

  // Get priority indicator
  const priorityColors = {
    'High': 'bg-red-500',
    'Medium': 'bg-amber-500',
    'Low': 'bg-green-500'
  };

  const priorityColor = priorityColors[schedule.priority] || 'bg-amber-500';

  // Format time
  const timeFormatted = new Date(`2000-01-01T${schedule.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  scheduleItem.innerHTML = `
    <div class="flex items-center p-4">
      <div class="flex-shrink-0 mr-4">
        <div class="w-12 h-12 rounded-full ${typeColor} flex items-center justify-center">
          ${getScheduleTypeIcon(schedule.type)}
        </div>
      </div>
      <div class="flex-grow">
        <div class="flex items-center">
          <h4 class="font-medium text-dark-900 dark:text-white">${schedule.title}</h4>
          <span class="ml-2 px-2 py-0.5 text-xs rounded-full ${typeColor}">${schedule.type}</span>
          <div class="ml-2 w-3 h-3 rounded-full ${priorityColor}" title="${schedule.priority} Priority"></div>
        </div>
        <div class="text-sm text-dark-500 dark:text-dark-400">
          <span>${timeFormatted}</span>
          ${schedule.contact ? `<span class="mx-1">•</span><span>${schedule.contact}</span>` : ''}
        </div>
        ${schedule.notes ? `<p class="mt-1 text-sm text-dark-600 dark:text-dark-300">${schedule.notes}</p>` : ''}
      </div>
      <div class="flex-shrink-0 ml-4">
        <button class="text-dark-400 hover:text-dark-600 dark:text-dark-500 dark:hover:text-dark-300 p-1" onclick="editSchedule('${schedule.id}')">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button class="text-dark-400 hover:text-dark-600 dark:text-dark-500 dark:hover:text-dark-300 p-1" onclick="deleteSchedule('${schedule.id}')">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <button class="text-dark-400 hover:text-dark-600 dark:text-dark-500 dark:hover:text-dark-300 p-1" onclick="toggleScheduleCompletion('${schedule.id}', ${!schedule.completed})">
          ${schedule.completed ?
            `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>` :
            `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>`
          }
        </button>
      </div>
    </div>
  `;

  return scheduleItem;
}

// Get icon for schedule type
function getScheduleTypeIcon(type) {
  switch (type) {
    case 'Meeting':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>`;
    case 'Call':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>`;
    case 'Email':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>`;
    case 'Visit':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>`;
    case 'Task':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>`;
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>`;
  }
}

// Filter schedules based on search and filter
async function filterSchedules() {
  try {
    const searchInput = document.getElementById('schedule-search');
    const filterSelect = document.getElementById('schedule-filter');

    if (!searchInput || !filterSelect) return;

    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;

    // Get schedules from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let schedules = await idbKeyval.get('schedules', dbPromise) || [];

    // Filter schedules
    let filteredSchedules = schedules;

    // Apply completion filter
    if (filterValue === 'pending') {
      filteredSchedules = filteredSchedules.filter(schedule => !schedule.completed);
    } else if (filterValue === 'completed') {
      filteredSchedules = filteredSchedules.filter(schedule => schedule.completed);
    }

    // Apply type filter
    if (filterValue === 'meeting') {
      filteredSchedules = filteredSchedules.filter(schedule => schedule.type === 'Meeting');
    } else if (filterValue === 'call') {
      filteredSchedules = filteredSchedules.filter(schedule => schedule.type === 'Call');
    } else if (filterValue === 'email') {
      filteredSchedules = filteredSchedules.filter(schedule => schedule.type === 'Email');
    } else if (filterValue === 'visit') {
      filteredSchedules = filteredSchedules.filter(schedule => schedule.type === 'Visit');
    } else if (filterValue === 'task') {
      filteredSchedules = filteredSchedules.filter(schedule => schedule.type === 'Task');
    }

    // Apply search filter
    if (searchTerm) {
      filteredSchedules = filteredSchedules.filter(schedule =>
        schedule.title.toLowerCase().includes(searchTerm) ||
        (schedule.notes && schedule.notes.toLowerCase().includes(searchTerm)) ||
        (schedule.contact && schedule.contact.toLowerCase().includes(searchTerm))
      );
    }

    // Render filtered schedules
    renderSchedules(filteredSchedules);
  } catch (error) {
    console.error('Error filtering schedules:', error);
  }
}

// Toggle schedule completion status
async function toggleScheduleCompletion(scheduleId, completed) {
  try {
    // Get schedules from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let schedules = await idbKeyval.get('schedules', dbPromise) || [];

    // Find and update the schedule
    const scheduleIndex = schedules.findIndex(schedule => schedule.id === scheduleId);

    if (scheduleIndex !== -1) {
      schedules[scheduleIndex].completed = completed;

      // Save to IndexedDB
      await idbKeyval.set('schedules', schedules, dbPromise);

      // Reload schedules
      await loadSchedules();

      // Add to timeline
      if (window.LeewayAIFeatures && typeof window.LeewayAIFeatures.addToTimeline === 'function') {
        await window.LeewayAIFeatures.addToTimeline({
          type: schedules[scheduleIndex].type.toLowerCase(),
          title: `${completed ? 'Completed' : 'Reopened'} Schedule: ${schedules[scheduleIndex].title}`,
          description: `${completed ? 'Marked as completed' : 'Marked as pending'}: ${schedules[scheduleIndex].title}`,
          related: schedules[scheduleIndex].contact || 'Scheduling',
          subtype: completed ? 'Schedule Completed' : 'Schedule Reopened'
        });
      }
    }
  } catch (error) {
    console.error('Error toggling schedule completion:', error);
  }
}

// Delete a schedule
async function deleteSchedule(scheduleId) {
  try {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this schedule?')) {
      return;
    }

    // Get schedules from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let schedules = await idbKeyval.get('schedules', dbPromise) || [];

    // Find the schedule
    const scheduleIndex = schedules.findIndex(schedule => schedule.id === scheduleId);

    if (scheduleIndex !== -1) {
      const deletedSchedule = schedules[scheduleIndex];

      // Remove the schedule
      schedules.splice(scheduleIndex, 1);

      // Save to IndexedDB
      await idbKeyval.set('schedules', schedules, dbPromise);

      // Reload schedules
      await loadSchedules();

      // Add to timeline
      if (window.LeewayAIFeatures && typeof window.LeewayAIFeatures.addToTimeline === 'function') {
        await window.LeewayAIFeatures.addToTimeline({
          type: 'note',
          title: `Deleted Schedule: ${deletedSchedule.title}`,
          description: `Deleted schedule: ${deletedSchedule.title}`,
          related: deletedSchedule.contact || 'Scheduling',
          subtype: 'Schedule Deleted'
        });
      }
    }
  } catch (error) {
    console.error('Error deleting schedule:', error);
  }
}

// Edit a schedule
async function editSchedule(scheduleId) {
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
    if (prioritySelect) prioritySelect.value = schedule.priority;

    // Store the schedule ID in a data attribute
    const scheduleForm = document.getElementById('schedule-form');
    if (scheduleForm) {
      scheduleForm.dataset.scheduleId = scheduleId;
    }

    // Show the modal
    modal.classList.remove('hidden');

    // Update save button handler
    const saveBtn = document.getElementById('save-schedule-btn');
    if (saveBtn) {
      // Remove existing event listeners
      const newSaveBtn = saveBtn.cloneNode(true);
      saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

      // Add new event listener
      newSaveBtn.addEventListener('click', function(e) {
        e.preventDefault();
        updateSchedule(scheduleId);
      });
    }
  } catch (error) {
    console.error('Error editing schedule:', error);
  }
}

// Initialize routing planner
function initializeRoutingPlanner() {
  console.log('Initializing Routing Planner...');

  // Set up map for routing
  setupRoutingMap();
}

// Set up map for routing
function setupRoutingMap() {
  const routingMap = document.getElementById('routing-map');
  if (!routingMap) return;

  // Initialize map
  const map = new google.maps.Map(routingMap, {
    center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  // Store map in global variable for later use
  window.routingMap = map;

  // Add markers for scheduled visits
  addScheduledVisitMarkers(map);
}

// Add markers for scheduled visits
async function addScheduledVisitMarkers(map) {
  try {
    // Get schedules from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let schedules = await idbKeyval.get('schedules', dbPromise) || [];

    // Filter for visit type schedules
    const visits = schedules.filter(schedule => schedule.type === 'Visit' && !schedule.completed);

    if (visits.length === 0) return;

    // Create bounds to fit all markers
    const bounds = new google.maps.LatLngBounds();

    // Add markers for each visit
    const markers = [];

    for (const visit of visits) {
      // Get location from visit notes or contact
      const locationText = visit.notes || visit.contact || '';

      // Skip if no location info
      if (!locationText) continue;

      // Geocode the location
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address: locationText }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
          const location = results[0].geometry.location;

          // Create marker
          const marker = new google.maps.Marker({
            position: location,
            map: map,
            title: visit.title,
            animation: google.maps.Animation.DROP
          });

          // Create info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-medium text-lg">${visit.title}</h3>
                <p>${new Date(visit.date + 'T' + visit.time).toLocaleString()}</p>
                ${visit.contact ? `<p><strong>Contact:</strong> ${visit.contact}</p>` : ''}
                ${visit.notes ? `<p><strong>Notes:</strong> ${visit.notes}</p>` : ''}
              </div>
            `
          });

          // Add click event to marker
          marker.addListener('click', function() {
            infoWindow.open(map, marker);
          });

          // Add to markers array
          markers.push(marker);

          // Extend bounds to include this marker
          bounds.extend(location);

          // Fit map to bounds if this is the last marker
          if (markers.length === visits.length) {
            map.fitBounds(bounds);
          }
        }
      });
    }
  } catch (error) {
    console.error('Error adding visit markers:', error);
  }
}

// Create a routing plan
async function createRoutingPlan() {
  try {
    // Get schedules from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let schedules = await idbKeyval.get('schedules', dbPromise) || [];

    // Filter for visit type schedules
    const visits = schedules.filter(schedule => schedule.type === 'Visit' && !schedule.completed);

    if (visits.length === 0) {
      alert('No pending visits found. Please schedule some visits first.');
      return;
    }

    // Show loading state
    const routingPlanContainer = document.getElementById('routing-plan');
    if (routingPlanContainer) {
      routingPlanContainer.innerHTML = `
        <div class="flex justify-center items-center p-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      `;
    }

    // Get locations for each visit
    const visitLocations = [];
    const geocoder = new google.maps.Geocoder();

    for (const visit of visits) {
      // Get location from visit notes or contact
      const locationText = visit.notes || visit.contact || '';

      // Skip if no location info
      if (!locationText) continue;

      // Geocode the location
      try {
        const result = await new Promise((resolve, reject) => {
          geocoder.geocode({ address: locationText }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK && results[0]) {
              resolve({
                visit: visit,
                location: results[0].geometry.location,
                address: results[0].formatted_address
              });
            } else {
              reject(new Error(`Geocoding failed for "${locationText}": ${status}`));
            }
          });
        });

        visitLocations.push(result);
      } catch (error) {
        console.error(error);
      }
    }

    if (visitLocations.length === 0) {
      alert('Could not geocode any visit locations. Please check your visit addresses.');
      return;
    }

    // Sort visits by date and time
    visitLocations.sort((a, b) => {
      const dateA = new Date(a.visit.date + 'T' + a.visit.time);
      const dateB = new Date(b.visit.date + 'T' + b.visit.time);
      return dateA - dateB;
    });

    // Create a DirectionsService object
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map: window.routingMap,
      suppressMarkers: true
    });

    // Create waypoints for the route
    const waypoints = visitLocations.slice(1, -1).map(visitLocation => ({
      location: visitLocation.location,
      stopover: true
    }));

    // Create request for directions
    const request = {
      origin: visitLocations[0].location,
      destination: visitLocations[visitLocations.length - 1].location,
      waypoints: waypoints,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    };

    // Get directions
    directionsService.route(request, function(result, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        // Display the route on the map
        directionsRenderer.setDirections(result);

        // Create the routing plan
        createRoutingPlanHTML(result, visitLocations);
      } else {
        alert('Could not calculate a route between the visits: ' + status);

        if (routingPlanContainer) {
          routingPlanContainer.innerHTML = `
            <div class="text-center p-6 text-dark-500 dark:text-dark-400">
              Could not calculate a route between the visits. Please check your visit addresses.
            </div>
          `;
        }
      }
    });
  } catch (error) {
    console.error('Error creating routing plan:', error);
  }
}

// Create HTML for routing plan
function createRoutingPlanHTML(directions, visitLocations) {
  const routingPlanContainer = document.getElementById('routing-plan');
  if (!routingPlanContainer) return;

  // Get route information
  const route = directions.routes[0];
  const legs = route.legs;

  // Calculate total distance and duration
  let totalDistance = 0;
  let totalDuration = 0;

  legs.forEach(leg => {
    totalDistance += leg.distance.value;
    totalDuration += leg.duration.value;
  });

  // Convert to miles and hours
  const totalDistanceMiles = (totalDistance / 1609.34).toFixed(1);
  const totalDurationHours = (totalDuration / 3600).toFixed(1);

  // Create HTML
  let html = `
    <div class="bg-white dark:bg-dark-800 rounded-lg shadow-md overflow-hidden">
      <div class="bg-primary text-white px-4 py-3">
        <h3 class="text-lg font-medium">Optimized Routing Plan</h3>
        <p class="text-sm opacity-80">Total: ${totalDistanceMiles} miles (approx. ${totalDurationHours} hours driving)</p>
      </div>
      <div class="p-4">
        <ol class="relative border-l border-dark-200 dark:border-dark-700">
  `;

  // Add each stop
  visitLocations.forEach((visitLocation, index) => {
    const visit = visitLocation.visit;
    const leg = index < legs.length ? legs[index] : null;

    // Format date and time
    const dateTime = new Date(visit.date + 'T' + visit.time);
    const formattedDateTime = dateTime.toLocaleString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    html += `
      <li class="mb-6 ml-6">
        <span class="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-4 ring-white dark:ring-dark-800">
          ${index + 1}
        </span>
        <div class="bg-dark-50 dark:bg-dark-700 p-3 rounded-lg">
          <h4 class="font-medium text-dark-900 dark:text-white">${visit.title}</h4>
          <p class="text-sm text-dark-500 dark:text-dark-400">${formattedDateTime}</p>
          <p class="text-sm text-dark-600 dark:text-dark-300">${visitLocation.address}</p>
          ${visit.contact ? `<p class="text-sm text-dark-600 dark:text-dark-300"><strong>Contact:</strong> ${visit.contact}</p>` : ''}
          ${visit.notes ? `<p class="text-sm text-dark-600 dark:text-dark-300"><strong>Notes:</strong> ${visit.notes}</p>` : ''}

          ${leg ? `
            <div class="mt-2 pt-2 border-t border-dark-200 dark:border-dark-600">
              <p class="text-sm text-dark-500 dark:text-dark-400">
                <strong>Next:</strong> ${leg.distance.text} (${leg.duration.text})
              </p>
              <p class="text-xs text-dark-500 dark:text-dark-400">${leg.start_address} → ${leg.end_address}</p>
            </div>
          ` : ''}
        </div>
      </li>
    `;
  });

  html += `
        </ol>
      </div>
      <div class="bg-dark-50 dark:bg-dark-700 px-4 py-3 text-right">
        <button id="save-routing-plan-btn" class="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
          Save Plan
        </button>
        <button id="export-routing-plan-btn" class="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-dark ml-2">
          Export
        </button>
      </div>
    </div>
  `;

  routingPlanContainer.innerHTML = html;

  // Add event listeners for buttons
  const saveBtn = document.getElementById('save-routing-plan-btn');
  const exportBtn = document.getElementById('export-routing-plan-btn');

  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      saveRoutingPlan(directions, visitLocations);
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', function() {
      exportRoutingPlan(directions, visitLocations);
    });
  }
}

// Save routing plan
async function saveRoutingPlan(directions, visitLocations) {
  try {
    // Create routing plan object
    const routingPlan = {
      id: 'routing_' + Date.now(),
      createdAt: new Date().toISOString(),
      visits: visitLocations.map(vl => vl.visit.id),
      totalDistance: directions.routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0),
      totalDuration: directions.routes[0].legs.reduce((total, leg) => total + leg.duration.value, 0)
    };

    // Save to IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let routingPlans = await idbKeyval.get('routing_plans', dbPromise) || [];
    routingPlans.push(routingPlan);
    await idbKeyval.set('routing_plans', routingPlans, dbPromise);

    // Add to timeline
    if (window.LeewayAIFeatures && typeof window.LeewayAIFeatures.addToTimeline === 'function') {
      await window.LeewayAIFeatures.addToTimeline({
        type: 'note',
        title: 'Created Routing Plan',
        description: `Created a routing plan for ${visitLocations.length} visits, covering ${(routingPlan.totalDistance / 1609.34).toFixed(1)} miles.`,
        related: 'Routing',
        subtype: 'Routing Plan Created'
      });
    }

    alert('Routing plan saved successfully!');
  } catch (error) {
    console.error('Error saving routing plan:', error);
  }
}

// Export routing plan
function exportRoutingPlan(directions, visitLocations) {
  try {
    // Get route information
    const route = directions.routes[0];
    const legs = route.legs;

    // Calculate total distance and duration
    let totalDistance = 0;
    let totalDuration = 0;

    legs.forEach(leg => {
      totalDistance += leg.distance.value;
      totalDuration += leg.duration.value;
    });

    // Convert to miles and hours
    const totalDistanceMiles = (totalDistance / 1609.34).toFixed(1);
    const totalDurationHours = (totalDuration / 3600).toFixed(1);

    // Create CSV content
    let csvContent = 'Stop,Title,Date,Time,Address,Contact,Notes,Distance to Next,Duration to Next\n';

    visitLocations.forEach((visitLocation, index) => {
      const visit = visitLocation.visit;
      const leg = index < legs.length ? legs[index] : null;

      // Format date and time
      const dateObj = new Date(visit.date + 'T' + visit.time);
      const formattedDate = dateObj.toLocaleDateString();
      const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Escape fields for CSV
      const escapeCSV = (field) => {
        if (field === null || field === undefined) return '';
        return `"${String(field).replace(/"/g, '""')}"`;
      };

      csvContent += [
        index + 1,
        escapeCSV(visit.title),
        escapeCSV(formattedDate),
        escapeCSV(formattedTime),
        escapeCSV(visitLocation.address),
        escapeCSV(visit.contact),
        escapeCSV(visit.notes),
        leg ? escapeCSV(leg.distance.text) : '',
        leg ? escapeCSV(leg.duration.text) : ''
      ].join(',') + '\n';
    });

    // Add summary row
    csvContent += `\n"Total","${visitLocations.length} stops","","","","","","${totalDistanceMiles} miles","${totalDurationHours} hours"\n`;

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `routing_plan_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting routing plan:', error);
  }
}