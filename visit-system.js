/**
 * Visit System for Agent Lee CRM
 * Provides functionality for scheduling and managing store visits
 */

// Initialize the visit system
function initializeVisitSystem() {
  console.log('Initializing Visit System...');

  // Set up event listeners for visit UI
  setupVisitEventListeners();

  // Load existing visits from IndexedDB
  loadVisits();

  // Initialize map for visits
  initializeVisitMap();
}

// Set up event listeners for visit UI
function setupVisitEventListeners() {
  console.log('Setting up visit event listeners...');

  // Schedule Visit button
  const scheduleVisitBtn = document.getElementById('schedule-visit-btn');
  if (scheduleVisitBtn) {
    scheduleVisitBtn.addEventListener('click', function() {
      console.log('Schedule Visit button clicked');
      const modal = document.getElementById('visit-modal');
      if (modal) {
        modal.classList.remove('hidden');
      }
    });
  } else {
    console.warn('Schedule Visit button not found');
  }

  // Visit form submission
  const visitForm = document.getElementById('visit-form');
  const saveVisitBtn = document.getElementById('save-visit');
  if (saveVisitBtn && visitForm) {
    saveVisitBtn.addEventListener('click', function(e) {
      e.preventDefault();
      saveVisit();
    });
  } else {
    console.warn('Save Visit button or form not found');
  }

  // Modal close buttons
  const closeVisitModal = document.getElementById('close-visit-modal');
  const cancelVisitBtn = document.getElementById('cancel-visit');

  if (closeVisitModal) {
    closeVisitModal.addEventListener('click', function() {
      const modal = document.getElementById('visit-modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    });
  } else {
    console.warn('Close Visit Modal button not found');
  }

  if (cancelVisitBtn) {
    cancelVisitBtn.addEventListener('click', function() {
      const modal = document.getElementById('visit-modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    });
  } else {
    console.warn('Cancel Visit button not found');
  }

  // Visit details modal close button
  const closeVisitDetails = document.getElementById('close-visit-details');
  if (closeVisitDetails) {
    closeVisitDetails.addEventListener('click', function() {
      const modal = document.getElementById('visit-details-modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    });
  }

  // Save visit outcome button
  const saveVisitOutcomeBtn = document.getElementById('save-visit-outcome');
  if (saveVisitOutcomeBtn) {
    saveVisitOutcomeBtn.addEventListener('click', function() {
      saveVisitOutcome();
    });
  }

  // Get directions button
  const getDirectionsBtn = document.getElementById('get-directions');
  if (getDirectionsBtn) {
    getDirectionsBtn.addEventListener('click', function() {
      const address = document.getElementById('visit-details-address').textContent;
      if (address) {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank');
      }
    });
  }

  // Delete visit button
  const deleteVisitBtn = document.getElementById('delete-visit');
  if (deleteVisitBtn) {
    deleteVisitBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to delete this visit?')) {
        deleteVisit();
      }
    });
  }

  // View toggle buttons
  const viewListBtn = document.getElementById('view-list-btn');
  const viewMapBtn = document.getElementById('view-map-btn');

  if (viewListBtn && viewMapBtn) {
    viewListBtn.addEventListener('click', function() {
      toggleVisitView('list');
    });

    viewMapBtn.addEventListener('click', function() {
      toggleVisitView('map');
    });
  }

  // Visit filter
  const visitFilter = document.getElementById('visit-filter');
  if (visitFilter) {
    visitFilter.addEventListener('change', function() {
      loadVisits();
    });
  }

  // Visit search
  const visitSearch = document.getElementById('visit-search');
  if (visitSearch) {
    visitSearch.addEventListener('input', function() {
      loadVisits();
    });
  }
}

// Save a visit
async function saveVisit() {
  try {
    const storeSelect = document.getElementById('visit-store');
    const dateInput = document.getElementById('visit-date');
    const timeInput = document.getElementById('visit-time');
    const durationInput = document.getElementById('visit-duration');
    const contactInput = document.getElementById('visit-contact');
    const purposeSelect = document.getElementById('visit-purpose');
    const notesInput = document.getElementById('visit-notes');

    if (!storeSelect || !dateInput || !timeInput || !durationInput || !purposeSelect) {
      console.error('Missing required form elements');
      return;
    }

    // Validate form
    if (!storeSelect.value || !dateInput.value || !timeInput.value) {
      alert('Please fill in all required fields');
      return;
    }

    // Create visit object
    const visit = {
      id: 'visit_' + Date.now(),
      store: storeSelect.value,
      storeName: storeSelect.options[storeSelect.selectedIndex].text,
      date: dateInput.value,
      time: timeInput.value,
      duration: durationInput.value,
      contact: contactInput ? contactInput.value : '',
      purpose: purposeSelect.value,
      notes: notesInput ? notesInput.value : '',
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    // Save to IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let visits = await idbKeyval.get('visits', dbPromise) || [];
    visits.push(visit);
    await idbKeyval.set('visits', visits, dbPromise);

    // Close modal
    const modal = document.getElementById('visit-modal');
    if (modal) {
      modal.classList.add('hidden');
    }

    // Reset form
    if (storeSelect) storeSelect.selectedIndex = 0;
    if (contactInput) contactInput.value = '';
    if (notesInput) notesInput.value = '';

    // Reload visits
    await loadVisits();

    // Add to timeline
    if (window.LeewayAIFeatures && typeof window.LeewayAIFeatures.addToTimeline === 'function') {
      await window.LeewayAIFeatures.addToTimeline({
        type: 'visit',
        title: 'Scheduled Visit: ' + visit.storeName,
        description: `Scheduled a visit to ${visit.storeName} on ${new Date(visit.date + 'T' + visit.time).toLocaleString()}${visit.contact ? ' with ' + visit.contact : ''}.`,
        related: visit.storeName,
        subtype: 'Visit Scheduled'
      });
    }

    // Show success message
    alert('Visit scheduled successfully!');
  } catch (error) {
    console.error('Error saving visit:', error);
    alert('Error scheduling visit. Please try again.');
  }
}

// Create sample visits for demonstration
function createSampleVisits() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  return [
    {
      id: 'visit_1',
      store: 'store_1',
      storeName: 'Milwaukee Music Store',
      date: formatDateForInput(tomorrow),
      time: '10:00',
      duration: 60,
      contact: 'John Smith',
      purpose: 'sales',
      notes: 'Discuss new guitar inventory and summer promotion',
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    },
    {
      id: 'visit_2',
      store: 'store_2',
      storeName: 'Guitar World',
      date: formatDateForInput(nextWeek),
      time: '14:30',
      duration: 45,
      contact: 'Sarah Johnson',
      purpose: 'product-demo',
      notes: 'Demonstrate new Elite Series guitars',
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    },
    {
      id: 'visit_3',
      store: 'store_3',
      storeName: 'Madison Music Center',
      date: formatDateForInput(lastWeek),
      time: '11:15',
      duration: 90,
      contact: 'Mike Williams',
      purpose: 'follow-up',
      notes: 'Follow up on last month\'s order and discuss new products',
      status: 'completed',
      createdAt: new Date(lastWeek).toISOString(),
      lastModified: new Date(lastWeek).toISOString()
    },
    {
      id: 'visit_4',
      store: 'store_4',
      storeName: 'Chicago Instruments',
      date: formatDateForInput(lastWeek),
      time: '09:00',
      duration: 60,
      contact: 'Lisa Chen',
      purpose: 'maintenance',
      notes: 'Check on display setup and maintenance needs',
      status: 'cancelled',
      createdAt: new Date(lastWeek).toISOString(),
      lastModified: new Date(lastWeek).toISOString()
    }
  ];
}

// Format date for input fields (YYYY-MM-DD)
function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Load visits from IndexedDB
async function loadVisits() {
  try {
    const visitsList = document.getElementById('visits-list');
    if (!visitsList) return;

    // Show loading state
    visitsList.innerHTML = `
      <div class="flex justify-center items-center p-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    `;

    // Get visits from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let visits = await idbKeyval.get('visits', dbPromise) || [];

    // If no visits exist, create some sample visits
    if (visits.length === 0) {
      visits = createSampleVisits();
      await idbKeyval.set('visits', visits, dbPromise);
    }

    // Apply search filter
    const searchTerm = document.getElementById('visit-search')?.value.toLowerCase() || '';
    if (searchTerm) {
      visits = visits.filter(visit =>
        visit.storeName.toLowerCase().includes(searchTerm) ||
        (visit.contact && visit.contact.toLowerCase().includes(searchTerm)) ||
        (visit.notes && visit.notes.toLowerCase().includes(searchTerm))
      );
    }

    // Apply status filter
    const statusFilter = document.getElementById('visit-filter')?.value || 'all';
    if (statusFilter !== 'all') {
      visits = visits.filter(visit => visit.status === statusFilter);
    }

    // Update visit stats
    updateVisitStats(visits);

    // Render visits
    renderVisits(visits);

    // Update map markers
    updateVisitMapMarkers(visits);
  } catch (error) {
    console.error('Error loading visits:', error);
  }
}

// Update visit statistics
function updateVisitStats(visits) {
  const totalVisits = visits.length;
  const upcomingVisits = visits.filter(visit => visit.status === 'scheduled').length;
  const completedVisits = visits.filter(visit => visit.status === 'completed').length;
  const cancelledVisits = visits.filter(visit => visit.status === 'cancelled').length;

  // Update UI
  const statsElements = document.querySelectorAll('.grid-cols-4 .text-2xl');
  if (statsElements.length >= 4) {
    statsElements[0].textContent = totalVisits;
    statsElements[1].textContent = upcomingVisits;
    statsElements[2].textContent = completedVisits;
    statsElements[3].textContent = cancelledVisits;
  }
}

// Render visits list
function renderVisits(visits) {
  const visitsList = document.getElementById('visits-list');
  if (!visitsList) return;

  // Clear loading animation
  visitsList.innerHTML = '';

  if (visits.length === 0) {
    visitsList.innerHTML = `
      <div class="text-center p-6 text-dark-500 dark:text-dark-400">
        No visits found. Schedule a new visit to get started.
      </div>
    `;
    return;
  }

  // Sort visits by date (upcoming first)
  visits.sort((a, b) => {
    if (a.status === 'scheduled' && b.status !== 'scheduled') return -1;
    if (a.status !== 'scheduled' && b.status === 'scheduled') return 1;
    return new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time);
  });

  // Render each visit
  visits.forEach(visit => {
    const visitDate = new Date(visit.date + 'T' + visit.time);
    const formattedDate = visitDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    const formattedTime = visitDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const statusClass = getStatusClass(visit.status);

    const visitCard = document.createElement('div');
    visitCard.className = 'bg-white dark:bg-dark-700 rounded-xl p-4 shadow-sm border border-dark-100/50 dark:border-dark-700/50 hover:shadow-md transition-shadow';

    visitCard.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-start">
          <div class="w-12 h-12 rounded-lg ${statusClass} flex items-center justify-center text-white mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-display font-bold text-dark-900 dark:text-white">${visit.storeName}</h3>
            <p class="text-dark-600 dark:text-dark-400 text-sm">${formattedDate} at ${formattedTime} (${visit.duration} min)</p>
            ${visit.contact ? `<p class="text-dark-500 dark:text-dark-400 text-sm">Contact: ${visit.contact}</p>` : ''}
            <p class="text-dark-500 dark:text-dark-400 text-sm">Purpose: ${formatPurpose(visit.purpose)}</p>
          </div>
        </div>
        <div>
          <button type="button" class="view-visit-details p-2 text-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" data-id="${visit.id}" aria-label="View visit details">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>
    `;

    // Add event listener for view details button
    const viewDetailsBtn = visitCard.querySelector('.view-visit-details');
    if (viewDetailsBtn) {
      viewDetailsBtn.addEventListener('click', () => viewVisitDetails(visit.id));
    }

    visitsList.appendChild(visitCard);
  });
}

// Get status class for styling
function getStatusClass(status) {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-500';
    case 'completed':
      return 'bg-green-500';
    case 'cancelled':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

// Format purpose for display
function formatPurpose(purpose) {
  switch (purpose) {
    case 'sales':
      return 'Sales Presentation';
    case 'follow-up':
      return 'Follow-up Meeting';
    case 'product-demo':
      return 'Product Demonstration';
    case 'maintenance':
      return 'Maintenance';
    case 'training':
      return 'Training';
    case 'other':
      return 'Other';
    default:
      return purpose;
  }
}

// View visit details
async function viewVisitDetails(visitId) {
  try {
    // Get visits from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    const visits = await idbKeyval.get('visits', dbPromise) || [];

    // Find the visit
    const visit = visits.find(v => v.id === visitId);
    if (!visit) {
      console.error('Visit not found:', visitId);
      return;
    }

    // Update modal content
    const modal = document.getElementById('visit-details-modal');
    const titleElement = document.getElementById('visit-details-title');
    const storeElement = document.getElementById('visit-details-store');
    const addressElement = document.getElementById('visit-details-address');
    const datetimeElement = document.getElementById('visit-details-datetime');
    const durationElement = document.getElementById('visit-details-duration');
    const contactElement = document.getElementById('visit-details-contact');
    const purposeElement = document.getElementById('visit-details-purpose');
    const notesElement = document.getElementById('visit-details-notes');
    const statusElement = document.getElementById('visit-details-status');

    if (titleElement) titleElement.textContent = 'Visit to ' + visit.storeName;
    if (storeElement) storeElement.textContent = visit.storeName;
    if (addressElement) addressElement.textContent = getStoreAddress(visit.store);

    const visitDate = new Date(visit.date + 'T' + visit.time);
    if (datetimeElement) datetimeElement.textContent = visitDate.toLocaleString();
    if (durationElement) durationElement.textContent = visit.duration + ' minutes';
    if (contactElement) contactElement.textContent = visit.contact || 'Not specified';
    if (purposeElement) purposeElement.textContent = formatPurpose(visit.purpose);
    if (notesElement) notesElement.textContent = visit.notes || 'No notes';

    if (statusElement) {
      statusElement.textContent = visit.status.charAt(0).toUpperCase() + visit.status.slice(1);
      statusElement.className = 'inline-block px-2 py-1 text-xs rounded mb-2';

      switch (visit.status) {
        case 'scheduled':
          statusElement.classList.add('bg-blue-100', 'text-blue-800', 'dark:bg-blue-900/30', 'dark:text-blue-200');
          break;
        case 'completed':
          statusElement.classList.add('bg-green-100', 'text-green-800', 'dark:bg-green-900/30', 'dark:text-green-200');
          break;
        case 'cancelled':
          statusElement.classList.add('bg-red-100', 'text-red-800', 'dark:bg-red-900/30', 'dark:text-red-200');
          break;
      }
    }

    // Set up outcome form
    const outcomeStatusSelect = document.getElementById('visit-outcome-status');
    if (outcomeStatusSelect) {
      for (let i = 0; i < outcomeStatusSelect.options.length; i++) {
        if (outcomeStatusSelect.options[i].value === visit.status) {
          outcomeStatusSelect.selectedIndex = i;
          break;
        }
      }
    }

    const outcomeNotesInput = document.getElementById('visit-outcome-notes');
    if (outcomeNotesInput) {
      outcomeNotesInput.value = visit.outcomeNotes || '';
    }

    // Store the current visit ID for save/delete operations
    if (modal) {
      modal.dataset.visitId = visitId;
      modal.classList.remove('hidden');
    }

    // Initialize map
    initializeVisitDetailsMap(visit);

  } catch (error) {
    console.error('Error viewing visit details:', error);
  }
}

// Get store address (mock function)
function getStoreAddress(storeId) {
  const addresses = {
    'store_1': '123 Main Street, Milwaukee, WI 53202',
    'store_2': '456 Oak Avenue, Madison, WI 53703',
    'store_3': '789 Pine Road, Green Bay, WI 54301',
    'store_4': '321 Michigan Avenue, Chicago, IL 60601',
    'store_5': '654 State Street, Minneapolis, MN 55402'
  };

  return addresses[storeId] || 'Address not available';
}

// Initialize map for visit details
function initializeVisitDetailsMap(visit) {
  const mapContainer = document.getElementById('visit-details-map');
  if (!mapContainer) return;

  // For now, just show a placeholder
  mapContainer.innerHTML = `
    <div class="w-full h-full flex items-center justify-center bg-dark-100 dark:bg-dark-600 text-dark-500 dark:text-dark-400">
      <p>Map for ${visit.storeName}</p>
    </div>
  `;

  // In a real implementation, you would initialize a Google Map here
  // using the store's address or coordinates
}

// Initialize map for visits
function initializeVisitMap() {
  const mapContainer = document.getElementById('map-container');
  if (!mapContainer) return;

  // For now, just show a placeholder
  mapContainer.innerHTML = `
    <div class="w-full h-full flex items-center justify-center bg-dark-100 dark:bg-dark-600 text-dark-500 dark:text-dark-400">
      <p>Store Locations Map</p>
    </div>
  `;

  // In a real implementation, you would initialize a Google Map here
}

// Update map markers for visits
function updateVisitMapMarkers(visits) {
  // In a real implementation, you would update the map markers here
  console.log('Updating map markers for', visits.length, 'visits');
}

// Toggle between list and map view
function toggleVisitView(view) {
  const listBtn = document.getElementById('view-list-btn');
  const mapBtn = document.getElementById('view-map-btn');
  const listContainer = document.getElementById('visit-list-container');
  const mapContainer = document.getElementById('map-container');

  if (!listBtn || !mapBtn || !listContainer || !mapContainer) return;

  if (view === 'list') {
    listContainer.classList.remove('hidden');
    mapContainer.classList.add('hidden');
    listBtn.classList.add('gradient-btn', 'text-white');
    listBtn.classList.remove('text-dark-700', 'dark:text-dark-300', 'bg-dark-100', 'dark:bg-dark-700');
    mapBtn.classList.remove('gradient-btn', 'text-white');
    mapBtn.classList.add('text-dark-700', 'dark:text-dark-300', 'bg-dark-100', 'dark:bg-dark-700');
  } else {
    listContainer.classList.add('hidden');
    mapContainer.classList.remove('hidden');
    mapBtn.classList.add('gradient-btn', 'text-white');
    mapBtn.classList.remove('text-dark-700', 'dark:text-dark-300', 'bg-dark-100', 'dark:bg-dark-700');
    listBtn.classList.remove('gradient-btn', 'text-white');
    listBtn.classList.add('text-dark-700', 'dark:text-dark-300', 'bg-dark-100', 'dark:bg-dark-700');
  }
}

// Save visit outcome
async function saveVisitOutcome() {
  try {
    const modal = document.getElementById('visit-details-modal');
    if (!modal || !modal.dataset.visitId) return;

    const visitId = modal.dataset.visitId;
    const statusSelect = document.getElementById('visit-outcome-status');
    const notesInput = document.getElementById('visit-outcome-notes');
    const followUpYes = document.querySelector('input[name="follow-up"][value="yes"]');
    const followUpDateInput = document.getElementById('visit-follow-up-date');

    if (!statusSelect) return;

    // Get visits from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let visits = await idbKeyval.get('visits', dbPromise) || [];

    // Find the visit
    const visitIndex = visits.findIndex(v => v.id === visitId);
    if (visitIndex === -1) {
      console.error('Visit not found:', visitId);
      return;
    }

    // Update visit
    visits[visitIndex].status = statusSelect.value;
    visits[visitIndex].outcomeNotes = notesInput ? notesInput.value : '';
    visits[visitIndex].lastModified = new Date().toISOString();

    // Handle follow-up
    if (followUpYes && followUpYes.checked && followUpDateInput && followUpDateInput.value) {
      visits[visitIndex].followUp = {
        required: true,
        date: followUpDateInput.value
      };
    } else {
      visits[visitIndex].followUp = {
        required: false,
        date: null
      };
    }

    // Save to IndexedDB
    await idbKeyval.set('visits', visits, dbPromise);

    // Close modal
    modal.classList.add('hidden');

    // Reload visits
    await loadVisits();

    // Show success message
    alert('Visit outcome saved successfully!');
  } catch (error) {
    console.error('Error saving visit outcome:', error);
  }
}

// Delete visit
async function deleteVisit() {
  try {
    const modal = document.getElementById('visit-details-modal');
    if (!modal || !modal.dataset.visitId) return;

    const visitId = modal.dataset.visitId;

    // Get visits from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let visits = await idbKeyval.get('visits', dbPromise) || [];

    // Filter out the visit to delete
    visits = visits.filter(v => v.id !== visitId);

    // Save to IndexedDB
    await idbKeyval.set('visits', visits, dbPromise);

    // Close modal
    modal.classList.add('hidden');

    // Reload visits
    await loadVisits();

    // Show success message
    alert('Visit deleted successfully!');
  } catch (error) {
    console.error('Error deleting visit:', error);
  }
}

// Initialize the visit system when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the visit system
  initializeVisitSystem();
});

// Make the functions available globally
window.VisitSystem = {
  initialize: initializeVisitSystem,
  saveVisit: saveVisit,
  loadVisits: loadVisits,
  viewVisitDetails: viewVisitDetails,
  saveVisitOutcome: saveVisitOutcome,
  deleteVisit: deleteVisit,
  toggleVisitView: toggleVisitView
};
