/**
 * Records System for Agent Lee CRM
 * Provides functionality for managing store records and contacts
 */

// Initialize the records system
function initializeRecordsSystem() {
  console.log('Initializing Records System...');

  // Set up event listeners for records UI
  setupRecordsEventListeners();

  // Load existing records from IndexedDB
  loadRecords();

  // Initialize collaboration system
  initializeCollaborationSystem();
}

// Set up event listeners for records UI
function setupRecordsEventListeners() {
  console.log('Setting up records event listeners...');

  // Add Record button
  const addRecordBtn = document.getElementById('add-record-btn');
  if (addRecordBtn) {
    addRecordBtn.addEventListener('click', function() {
      console.log('Add Record button clicked');
      const modal = document.getElementById('add-record-modal');
      if (modal) {
        modal.classList.remove('hidden');
      }
    });
  } else {
    console.warn('Add Record button not found');
  }

  // Record form submission
  const recordForm = document.getElementById('record-form');
  const saveRecordBtn = document.getElementById('save-record');
  if (saveRecordBtn && recordForm) {
    saveRecordBtn.addEventListener('click', function(e) {
      e.preventDefault();
      saveRecord();
    });
  } else {
    console.warn('Save Record button or form not found');
  }

  // Modal close buttons
  const closeRecordModal = document.getElementById('close-record-modal');
  const cancelRecordBtn = document.getElementById('cancel-record');
  
  if (closeRecordModal) {
    closeRecordModal.addEventListener('click', function() {
      const modal = document.getElementById('add-record-modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    });
  } else {
    console.warn('Close Record Modal button not found');
  }
  
  if (cancelRecordBtn) {
    cancelRecordBtn.addEventListener('click', function() {
      const modal = document.getElementById('add-record-modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    });
  } else {
    console.warn('Cancel Record button not found');
  }

  // Record details modal close button
  const closeRecordDetails = document.getElementById('close-record-details');
  if (closeRecordDetails) {
    closeRecordDetails.addEventListener('click', function() {
      const modal = document.getElementById('record-details-modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    });
  }

  // Search and filter
  const recordsSearch = document.getElementById('records-search');
  if (recordsSearch) {
    recordsSearch.addEventListener('input', function() {
      filterRecords();
    });
  }

  const recordsFilter = document.getElementById('records-filter');
  if (recordsFilter) {
    recordsFilter.addEventListener('change', function() {
      filterRecords();
    });
  }

  // Collaboration buttons
  const addToCollabBtn = document.querySelectorAll('.add-to-collab');
  addToCollabBtn.forEach(btn => {
    btn.addEventListener('click', function() {
      const recordId = this.dataset.recordId;
      addToCollaboration(recordId);
    });
  });
}

// Save a new record
async function saveRecord() {
  try {
    const nameInput = document.getElementById('record-name');
    const companyInput = document.getElementById('record-company');
    const addressInput = document.getElementById('record-address');
    const cityInput = document.getElementById('record-city');
    const stateInput = document.getElementById('record-state');
    const zipInput = document.getElementById('record-zip');
    const phoneInput = document.getElementById('record-phone');
    const emailInput = document.getElementById('record-email');
    const websiteInput = document.getElementById('record-website');
    const tagsInput = document.getElementById('record-tags');
    const notesInput = document.getElementById('record-notes');

    if (!nameInput || !companyInput || !addressInput || !cityInput || !stateInput || !zipInput || !phoneInput) {
      console.error('Missing required form elements');
      return;
    }

    // Validate form
    if (!nameInput.value || !companyInput.value || !addressInput.value || !cityInput.value || !stateInput.value) {
      alert('Please fill in all required fields');
      return;
    }

    // Create record object
    const record = {
      id: 'record_' + Date.now(),
      name: nameInput.value.trim(),
      company: companyInput.value.trim(),
      address: addressInput.value.trim(),
      city: cityInput.value.trim(),
      state: stateInput.value.trim(),
      zip: zipInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput ? emailInput.value.trim() : '',
      website: websiteInput ? websiteInput.value.trim() : '',
      tags: tagsInput ? tagsInput.value.split(',').map(tag => tag.trim()) : [],
      notes: notesInput ? notesInput.value.trim() : '',
      visited: false,
      contacted: false,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    // Save to IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let records = await idbKeyval.get('records', dbPromise) || [];
    records.push(record);
    await idbKeyval.set('records', records, dbPromise);

    // Close modal
    const modal = document.getElementById('add-record-modal');
    if (modal) {
      modal.classList.add('hidden');
    }

    // Reset form
    const form = document.getElementById('record-form');
    if (form) form.reset();

    // Reload records
    await loadRecords();

    // Add to timeline
    if (window.LeewayAIFeatures && typeof window.LeewayAIFeatures.addToTimeline === 'function') {
      await window.LeewayAIFeatures.addToTimeline({
        type: 'record',
        title: 'Added Record: ' + record.name,
        description: `Added a new record for ${record.name} at ${record.company}.`,
        related: record.company,
        subtype: 'Record Created'
      });
    }

    // Show success message
    alert('Record added successfully!');
  } catch (error) {
    console.error('Error saving record:', error);
    alert('Error adding record. Please try again.');
  }
}

// Load records from IndexedDB
async function loadRecords() {
  try {
    const recordsList = document.getElementById('records-list');
    if (!recordsList) return;

    // Show loading state
    recordsList.innerHTML = `
      <div class="flex justify-center items-center p-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    `;

    // Get records from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let records = await idbKeyval.get('records', dbPromise) || [];

    // If no records exist, create some sample records
    if (records.length === 0) {
      // Use existing music stores data if available
      if (window.musicStores && window.musicStores.length > 0) {
        records = window.musicStores.map(store => ({
          id: 'record_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
          name: store.name.split(' ')[0] || 'Owner',
          company: store.name,
          address: store.address || '',
          city: store.city || '',
          state: store.state || '',
          zip: store.zip || '',
          phone: store.phone || '',
          email: store.email || '',
          website: store.website || '',
          tags: store.tags || [],
          notes: '',
          visited: Math.random() > 0.7,
          contacted: Math.random() > 0.5,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        }));
      } else {
        // Create sample records if no music stores data
        records = createSampleRecords();
      }
      await idbKeyval.set('records', records, dbPromise);
    }

    // Filter records based on search and filter
    records = filterRecordsData(records);

    // Render records
    renderRecords(records);
  } catch (error) {
    console.error('Error loading records:', error);
  }
}

// Filter records based on search and filter values
function filterRecordsData(records) {
  const searchTerm = document.getElementById('records-search')?.value.toLowerCase() || '';
  const filterValue = document.getElementById('records-filter')?.value || 'all';

  // Apply search filter
  let filteredRecords = records;
  if (searchTerm) {
    filteredRecords = filteredRecords.filter(record =>
      record.name.toLowerCase().includes(searchTerm) ||
      record.company.toLowerCase().includes(searchTerm) ||
      record.address.toLowerCase().includes(searchTerm) ||
      record.city.toLowerCase().includes(searchTerm) ||
      record.state.toLowerCase().includes(searchTerm) ||
      record.phone.includes(searchTerm) ||
      (record.email && record.email.toLowerCase().includes(searchTerm)) ||
      (record.notes && record.notes.toLowerCase().includes(searchTerm))
    );
  }

  // Apply status filter
  if (filterValue !== 'all') {
    switch (filterValue) {
      case 'visited':
        filteredRecords = filteredRecords.filter(record => record.visited);
        break;
      case 'unvisited':
        filteredRecords = filteredRecords.filter(record => !record.visited);
        break;
      case 'contacted':
        filteredRecords = filteredRecords.filter(record => record.contacted);
        break;
    }
  }

  return filteredRecords;
}

// Filter records and update UI
async function filterRecords() {
  const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
  let records = await idbKeyval.get('records', dbPromise) || [];
  
  // Filter records
  const filteredRecords = filterRecordsData(records);
  
  // Render filtered records
  renderRecords(filteredRecords);
}

// Initialize the records system when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the records system
  initializeRecordsSystem();
});

// Make the functions available globally
window.RecordsSystem = {
  initialize: initializeRecordsSystem,
  saveRecord: saveRecord,
  loadRecords: loadRecords,
  filterRecords: filterRecords
};
