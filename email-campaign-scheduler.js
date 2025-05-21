/**
 * Email Campaign Scheduler for Agent Lee CRM
 * Provides advanced email campaign scheduling and management
 */

// Initialize the email campaign scheduler
function initializeEmailCampaignScheduler() {
  console.log('Initializing Email Campaign Scheduler...');

  // Set up event listeners for email campaign UI
  setupEmailCampaignEventListeners();

  // Load existing email campaigns from IndexedDB
  loadEmailCampaigns();
}

// Set up event listeners for email campaign UI
function setupEmailCampaignEventListeners() {
  // Create campaign button
  const createCampaignBtn = document.getElementById('create-campaign-btn');
  if (createCampaignBtn) {
    createCampaignBtn.addEventListener('click', function() {
      const modal = document.getElementById('create-campaign-modal');
      if (modal) {
        modal.classList.remove('hidden');
      }
    });
  }

  // Campaign form submission
  const campaignForm = document.getElementById('campaign-form');
  if (campaignForm) {
    campaignForm.addEventListener('submit', function(e) {
      e.preventDefault();
      saveEmailCampaign();
    });
  }

  // Campaign search
  const campaignSearch = document.getElementById('campaign-search');
  if (campaignSearch) {
    campaignSearch.addEventListener('input', function() {
      filterEmailCampaigns();
    });
  }

  // Campaign filter
  const campaignFilter = document.getElementById('campaign-filter');
  if (campaignFilter) {
    campaignFilter.addEventListener('change', function() {
      filterEmailCampaigns();
    });
  }

  // Modal close buttons
  const closeCampaignModal = document.getElementById('close-campaign-modal');
  const cancelCampaignBtn = document.getElementById('cancel-campaign-btn');
  const campaignModalBackdrop = document.getElementById('campaign-modal-backdrop');

  [closeCampaignModal, cancelCampaignBtn, campaignModalBackdrop].forEach(element => {
    if (element) {
      element.addEventListener('click', function() {
        const modal = document.getElementById('create-campaign-modal');
        if (modal) {
          modal.classList.add('hidden');
        }
      });
    }
  });

  // Recipient selection
  const recipientTypeSelect = document.getElementById('recipient-type');
  const recipientListContainer = document.getElementById('recipient-list-container');
  const recipientSegmentContainer = document.getElementById('recipient-segment-container');

  if (recipientTypeSelect) {
    recipientTypeSelect.addEventListener('change', function() {
      if (recipientListContainer && recipientSegmentContainer) {
        if (this.value === 'list') {
          recipientListContainer.classList.remove('hidden');
          recipientSegmentContainer.classList.add('hidden');
        } else if (this.value === 'segment') {
          recipientListContainer.classList.add('hidden');
          recipientSegmentContainer.classList.remove('hidden');
        }
      }
    });
  }

  // Schedule type selection
  const scheduleTypeSelect = document.getElementById('schedule-type');
  const immediateContainer = document.getElementById('immediate-container');
  const scheduledContainer = document.getElementById('scheduled-container');
  const recurringContainer = document.getElementById('recurring-container');

  if (scheduleTypeSelect) {
    scheduleTypeSelect.addEventListener('change', function() {
      if (immediateContainer && scheduledContainer && recurringContainer) {
        if (this.value === 'immediate') {
          immediateContainer.classList.remove('hidden');
          scheduledContainer.classList.add('hidden');
          recurringContainer.classList.add('hidden');
        } else if (this.value === 'scheduled') {
          immediateContainer.classList.add('hidden');
          scheduledContainer.classList.remove('hidden');
          recurringContainer.classList.add('hidden');
        } else if (this.value === 'recurring') {
          immediateContainer.classList.add('hidden');
          scheduledContainer.classList.remove('hidden');
          recurringContainer.classList.remove('hidden');
        }
      }
    });
  }

  // Template selection
  const templateSelect = document.getElementById('email-template');
  const templatePreview = document.getElementById('template-preview');

  if (templateSelect && templatePreview) {
    templateSelect.addEventListener('change', function() {
      previewEmailTemplate(this.value);
    });
  }
}

// Save an email campaign
async function saveEmailCampaign() {
  try {
    const nameInput = document.getElementById('campaign-name');
    const subjectInput = document.getElementById('email-subject');
    const templateSelect = document.getElementById('email-template');
    const recipientTypeSelect = document.getElementById('recipient-type');
    const recipientListSelect = document.getElementById('recipient-list');
    const recipientSegmentSelect = document.getElementById('recipient-segment');
    const scheduleTypeSelect = document.getElementById('schedule-type');
    const scheduleDateInput = document.getElementById('schedule-date');
    const scheduleTimeInput = document.getElementById('schedule-time');
    const recurringTypeSelect = document.getElementById('recurring-type');
    const recurringDaysSelect = document.getElementById('recurring-days');

    if (!nameInput || !subjectInput || !templateSelect || !recipientTypeSelect || !scheduleTypeSelect) {
      console.error('Missing required form elements');
      return;
    }

    const name = nameInput.value.trim();
    const subject = subjectInput.value.trim();
    const template = templateSelect.value;
    const recipientType = recipientTypeSelect.value;
    const scheduleType = scheduleTypeSelect.value;

    if (!name || !subject || !template) {
      alert('Please fill in all required fields');
      return;
    }

    // Get recipients
    let recipients = [];
    if (recipientType === 'list' && recipientListSelect) {
      recipients = recipientListSelect.value;
    } else if (recipientType === 'segment' && recipientSegmentSelect) {
      recipients = recipientSegmentSelect.value;
    }

    // Get schedule
    let scheduleDate = null;
    let scheduleTime = null;
    let recurring = null;

    if (scheduleType === 'scheduled' || scheduleType === 'recurring') {
      if (!scheduleDateInput || !scheduleTimeInput) {
        alert('Please select a date and time for the campaign');
        return;
      }

      scheduleDate = scheduleDateInput.value;
      scheduleTime = scheduleTimeInput.value;

      if (scheduleType === 'recurring' && recurringTypeSelect && recurringDaysSelect) {
        recurring = {
          type: recurringTypeSelect.value,
          days: recurringDaysSelect.value
        };
      }
    }

    // Create campaign object
    const campaign = {
      id: 'campaign_' + Date.now(),
      name,
      subject,
      template,
      recipientType,
      recipients,
      scheduleType,
      scheduleDate,
      scheduleTime,
      recurring,
      status: scheduleType === 'immediate' ? 'sending' : 'scheduled',
      createdAt: new Date().toISOString(),
      stats: {
        sent: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0
      }
    };

    // Save to IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let campaigns = await idbKeyval.get('email_campaigns', dbPromise) || [];
    campaigns.push(campaign);
    await idbKeyval.set('email_campaigns', campaigns, dbPromise);

    // Close modal
    const modal = document.getElementById('create-campaign-modal');
    if (modal) {
      modal.classList.add('hidden');
    }

    // Reset form
    if (nameInput) nameInput.value = '';
    if (subjectInput) subjectInput.value = '';

    // Reload campaigns
    await loadEmailCampaigns();

    // Add to timeline
    if (window.LeewayAIFeatures && typeof window.LeewayAIFeatures.addToTimeline === 'function') {
      await window.LeewayAIFeatures.addToTimeline({
        type: 'email',
        title: 'Created Email Campaign: ' + name,
        description: `Created a new email campaign "${name}" with subject "${subject}". ${scheduleType === 'immediate' ? 'Sending immediately.' : 'Scheduled for ' + new Date(scheduleDate + 'T' + scheduleTime).toLocaleString() + '.'}`,
        related: 'Email Campaigns',
        subtype: 'Campaign Created'
      });
    }

    // Show success message
    alert('Email campaign created successfully!');

    // If immediate, start sending
    if (scheduleType === 'immediate') {
      simulateSendingCampaign(campaign.id);
    }
  } catch (error) {
    console.error('Error saving email campaign:', error);
  }
}

// Load email campaigns from IndexedDB
async function loadEmailCampaigns() {
  try {
    const campaignsList = document.getElementById('campaigns-list');
    if (!campaignsList) return;

    // Show loading state
    campaignsList.innerHTML = `
      <div class="flex justify-center items-center p-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    `;

    // Get campaigns from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let campaigns = await idbKeyval.get('email_campaigns', dbPromise) || [];

    if (campaigns.length === 0) {
      campaignsList.innerHTML = `
        <div class="text-center p-6 text-dark-500 dark:text-dark-400">
          No email campaigns found. Create a new campaign to get started.
        </div>
      `;
      return;
    }

    // Sort campaigns by created date (newest first)
    campaigns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Render campaigns
    renderEmailCampaigns(campaigns);
  } catch (error) {
    console.error('Error loading email campaigns:', error);
  }
}

// Render email campaigns in the UI
function renderEmailCampaigns(campaigns) {
  const campaignsList = document.getElementById('campaigns-list');
  if (!campaignsList) return;

  campaignsList.innerHTML = '';

  // Render each campaign
  campaigns.forEach(campaign => {
    const campaignItem = createCampaignItem(campaign);
    campaignsList.appendChild(campaignItem);
  });
}

// Create a campaign item element
function createCampaignItem(campaign) {
  const campaignItem = document.createElement('div');
  campaignItem.className = 'bg-white dark:bg-dark-800 rounded-lg shadow-md overflow-hidden mb-4';
  campaignItem.dataset.campaignId = campaign.id;

  // Get status badge color
  const statusColors = {
    'draft': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'scheduled': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'sending': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    'sent': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'failed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };

  const statusColor = statusColors[campaign.status] || statusColors.draft;

  // Format schedule date if available
  let scheduleInfo = '';
  if (campaign.scheduleType === 'scheduled' && campaign.scheduleDate && campaign.scheduleTime) {
    const scheduleDate = new Date(campaign.scheduleDate + 'T' + campaign.scheduleTime);
    scheduleInfo = `
      <div class="text-sm text-dark-500 dark:text-dark-400">
        <span class="inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Scheduled for ${scheduleDate.toLocaleString()}
        </span>
      </div>
    `;
  } else if (campaign.scheduleType === 'recurring' && campaign.scheduleDate && campaign.scheduleTime) {
    const scheduleDate = new Date(campaign.scheduleDate + 'T' + campaign.scheduleTime);
    const recurringType = campaign.recurring?.type || 'weekly';
    const recurringDays = campaign.recurring?.days || '';

    scheduleInfo = `
      <div class="text-sm text-dark-500 dark:text-dark-400">
        <span class="inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Recurring ${recurringType}, starting ${scheduleDate.toLocaleString()}
        </span>
      </div>
    `;
  } else if (campaign.scheduleType === 'immediate') {
    scheduleInfo = `
      <div class="text-sm text-dark-500 dark:text-dark-400">
        <span class="inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Immediate sending
        </span>
      </div>
    `;
  }

  // Create campaign stats
  const stats = campaign.stats || { sent: 0, opened: 0, clicked: 0, bounced: 0, unsubscribed: 0 };
  const openRate = stats.sent > 0 ? ((stats.opened / stats.sent) * 100).toFixed(1) : '0.0';
  const clickRate = stats.opened > 0 ? ((stats.clicked / stats.opened) * 100).toFixed(1) : '0.0';

  campaignItem.innerHTML = `
    <div class="p-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-medium text-dark-900 dark:text-white">${campaign.name}</h3>
        <span class="px-2 py-1 text-xs rounded-full ${statusColor}">${campaign.status}</span>
      </div>

      <p class="text-dark-600 dark:text-dark-300 mb-2">${campaign.subject}</p>

      ${scheduleInfo}

      <div class="mt-4 grid grid-cols-5 gap-2 text-center">
        <div class="bg-dark-50 dark:bg-dark-700 p-2 rounded">
          <div class="text-lg font-medium text-dark-900 dark:text-white">${stats.sent}</div>
          <div class="text-xs text-dark-500 dark:text-dark-400">Sent</div>
        </div>
        <div class="bg-dark-50 dark:bg-dark-700 p-2 rounded">
          <div class="text-lg font-medium text-dark-900 dark:text-white">${stats.opened}</div>
          <div class="text-xs text-dark-500 dark:text-dark-400">Opened</div>
        </div>
        <div class="bg-dark-50 dark:bg-dark-700 p-2 rounded">
          <div class="text-lg font-medium text-dark-900 dark:text-white">${openRate}%</div>
          <div class="text-xs text-dark-500 dark:text-dark-400">Open Rate</div>
        </div>
        <div class="bg-dark-50 dark:bg-dark-700 p-2 rounded">
          <div class="text-lg font-medium text-dark-900 dark:text-white">${stats.clicked}</div>
          <div class="text-xs text-dark-500 dark:text-dark-400">Clicked</div>
        </div>
        <div class="bg-dark-50 dark:bg-dark-700 p-2 rounded">
          <div class="text-lg font-medium text-dark-900 dark:text-white">${clickRate}%</div>
          <div class="text-xs text-dark-500 dark:text-dark-400">Click Rate</div>
        </div>
      </div>
    </div>

    <div class="bg-dark-50 dark:bg-dark-700 px-4 py-3 flex justify-end">
      <button class="text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200 mr-3" onclick="viewCampaignDetails('${campaign.id}')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
      <button class="text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200 mr-3" onclick="duplicateCampaign('${campaign.id}')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
      <button class="text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200" onclick="deleteCampaign('${campaign.id}')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  `;

  return campaignItem;
}

// Filter email campaigns based on search and filter
async function filterEmailCampaigns() {
  try {
    const searchInput = document.getElementById('campaign-search');
    const filterSelect = document.getElementById('campaign-filter');

    if (!searchInput || !filterSelect) return;

    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;

    // Get campaigns from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let campaigns = await idbKeyval.get('email_campaigns', dbPromise) || [];

    // Filter campaigns
    let filteredCampaigns = campaigns;

    // Apply status filter
    if (filterValue !== 'all') {
      filteredCampaigns = filteredCampaigns.filter(campaign => campaign.status === filterValue);
    }

    // Apply search filter
    if (searchTerm) {
      filteredCampaigns = filteredCampaigns.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm) ||
        campaign.subject.toLowerCase().includes(searchTerm)
      );
    }

    // Render filtered campaigns
    renderEmailCampaigns(filteredCampaigns);
  } catch (error) {
    console.error('Error filtering email campaigns:', error);
  }
}

// View campaign details
async function viewCampaignDetails(campaignId) {
  try {
    // Get campaigns from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let campaigns = await idbKeyval.get('email_campaigns', dbPromise) || [];

    // Find the campaign
    const campaign = campaigns.find(campaign => campaign.id === campaignId);

    if (!campaign) {
      console.error('Campaign not found:', campaignId);
      return;
    }

    // Open the modal
    const modal = document.getElementById('campaign-details-modal');
    if (!modal) {
      console.error('Modal not found');
      return;
    }

    // Update modal content
    const modalTitle = document.getElementById('campaign-details-title');
    const modalContent = document.getElementById('campaign-details-content');

    if (modalTitle) {
      modalTitle.textContent = campaign.name;
    }

    if (modalContent) {
      // Format schedule date if available
      let scheduleInfo = '';
      if (campaign.scheduleType === 'scheduled' && campaign.scheduleDate && campaign.scheduleTime) {
        const scheduleDate = new Date(campaign.scheduleDate + 'T' + campaign.scheduleTime);
        scheduleInfo = `<p><strong>Schedule:</strong> ${scheduleDate.toLocaleString()}</p>`;
      } else if (campaign.scheduleType === 'recurring' && campaign.scheduleDate && campaign.scheduleTime) {
        const scheduleDate = new Date(campaign.scheduleDate + 'T' + campaign.scheduleTime);
        const recurringType = campaign.recurring?.type || 'weekly';
        const recurringDays = campaign.recurring?.days || '';

        scheduleInfo = `<p><strong>Schedule:</strong> Recurring ${recurringType}, starting ${scheduleDate.toLocaleString()}</p>`;
      } else if (campaign.scheduleType === 'immediate') {
        scheduleInfo = `<p><strong>Schedule:</strong> Immediate sending</p>`;
      }

      // Create campaign stats
      const stats = campaign.stats || { sent: 0, opened: 0, clicked: 0, bounced: 0, unsubscribed: 0 };
      const openRate = stats.sent > 0 ? ((stats.opened / stats.sent) * 100).toFixed(1) : '0.0';
      const clickRate = stats.opened > 0 ? ((stats.clicked / stats.opened) * 100).toFixed(1) : '0.0';
      const bounceRate = stats.sent > 0 ? ((stats.bounced / stats.sent) * 100).toFixed(1) : '0.0';
      const unsubscribeRate = stats.sent > 0 ? ((stats.unsubscribed / stats.sent) * 100).toFixed(1) : '0.0';

      modalContent.innerHTML = `
        <div class="space-y-4">
          <div>
            <p><strong>Subject:</strong> ${campaign.subject}</p>
            <p><strong>Template:</strong> ${campaign.template}</p>
            <p><strong>Status:</strong> <span class="px-2 py-1 text-xs rounded-full ${getStatusColor(campaign.status)}">${campaign.status}</span></p>
            <p><strong>Created:</strong> ${new Date(campaign.createdAt).toLocaleString()}</p>
            ${scheduleInfo}
          </div>

          <div>
            <h4 class="font-medium text-lg mb-2">Campaign Statistics</h4>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-dark-50 dark:bg-dark-700 p-3 rounded">
                <div class="text-2xl font-medium text-dark-900 dark:text-white">${stats.sent}</div>
                <div class="text-sm text-dark-500 dark:text-dark-400">Emails Sent</div>
              </div>
              <div class="bg-dark-50 dark:bg-dark-700 p-3 rounded">
                <div class="text-2xl font-medium text-dark-900 dark:text-white">${stats.opened}</div>
                <div class="text-sm text-dark-500 dark:text-dark-400">Emails Opened</div>
              </div>
              <div class="bg-dark-50 dark:bg-dark-700 p-3 rounded">
                <div class="text-2xl font-medium text-dark-900 dark:text-white">${openRate}%</div>
                <div class="text-sm text-dark-500 dark:text-dark-400">Open Rate</div>
              </div>
              <div class="bg-dark-50 dark:bg-dark-700 p-3 rounded">
                <div class="text-2xl font-medium text-dark-900 dark:text-white">${stats.clicked}</div>
                <div class="text-sm text-dark-500 dark:text-dark-400">Clicks</div>
              </div>
              <div class="bg-dark-50 dark:bg-dark-700 p-3 rounded">
                <div class="text-2xl font-medium text-dark-900 dark:text-white">${clickRate}%</div>
                <div class="text-sm text-dark-500 dark:text-dark-400">Click Rate</div>
              </div>
              <div class="bg-dark-50 dark:bg-dark-700 p-3 rounded">
                <div class="text-2xl font-medium text-dark-900 dark:text-white">${stats.bounced}</div>
                <div class="text-sm text-dark-500 dark:text-dark-400">Bounces (${bounceRate}%)</div>
              </div>
              <div class="bg-dark-50 dark:bg-dark-700 p-3 rounded">
                <div class="text-2xl font-medium text-dark-900 dark:text-white">${stats.unsubscribed}</div>
                <div class="text-sm text-dark-500 dark:text-dark-400">Unsubscribes (${unsubscribeRate}%)</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Show the modal
    modal.classList.remove('hidden');
  } catch (error) {
    console.error('Error viewing campaign details:', error);
  }
}

// Get status color
function getStatusColor(status) {
  const statusColors = {
    'draft': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'scheduled': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'sending': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    'sent': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'failed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };

  return statusColors[status] || statusColors.draft;
}

// Duplicate a campaign
async function duplicateCampaign(campaignId) {
  try {
    // Get campaigns from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let campaigns = await idbKeyval.get('email_campaigns', dbPromise) || [];

    // Find the campaign
    const campaign = campaigns.find(campaign => campaign.id === campaignId);

    if (!campaign) {
      console.error('Campaign not found:', campaignId);
      return;
    }

    // Create a duplicate campaign
    const duplicateCampaign = {
      ...campaign,
      id: 'campaign_' + Date.now(),
      name: `${campaign.name} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      stats: {
        sent: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0
      }
    };

    // Save to IndexedDB
    campaigns.push(duplicateCampaign);
    await idbKeyval.set('email_campaigns', campaigns, dbPromise);

    // Reload campaigns
    await loadEmailCampaigns();

    // Add to timeline
    if (window.LeewayAIFeatures && typeof window.LeewayAIFeatures.addToTimeline === 'function') {
      await window.LeewayAIFeatures.addToTimeline({
        type: 'email',
        title: 'Duplicated Email Campaign',
        description: `Duplicated email campaign "${campaign.name}" to "${duplicateCampaign.name}".`,
        related: 'Email Campaigns',
        subtype: 'Campaign Duplicated'
      });
    }

    // Show success message
    alert('Campaign duplicated successfully!');
  } catch (error) {
    console.error('Error duplicating campaign:', error);
  }
}

// Delete a campaign
async function deleteCampaign(campaignId) {
  try {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    // Get campaigns from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let campaigns = await idbKeyval.get('email_campaigns', dbPromise) || [];

    // Find the campaign
    const campaignIndex = campaigns.findIndex(campaign => campaign.id === campaignId);

    if (campaignIndex === -1) {
      console.error('Campaign not found:', campaignId);
      return;
    }

    const deletedCampaign = campaigns[campaignIndex];

    // Remove the campaign
    campaigns.splice(campaignIndex, 1);

    // Save to IndexedDB
    await idbKeyval.set('email_campaigns', campaigns, dbPromise);

    // Reload campaigns
    await loadEmailCampaigns();

    // Add to timeline
    if (window.LeewayAIFeatures && typeof window.LeewayAIFeatures.addToTimeline === 'function') {
      await window.LeewayAIFeatures.addToTimeline({
        type: 'email',
        title: 'Deleted Email Campaign',
        description: `Deleted email campaign "${deletedCampaign.name}".`,
        related: 'Email Campaigns',
        subtype: 'Campaign Deleted'
      });
    }

    // Show success message
    alert('Campaign deleted successfully!');
  } catch (error) {
    console.error('Error deleting campaign:', error);
  }
}

// Preview email template
function previewEmailTemplate(templateId) {
  const templatePreview = document.getElementById('template-preview');
  if (!templatePreview) return;

  // Get template content based on ID
  let templateContent = '';

  switch (templateId) {
    case 'template-1':
      templateContent = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 5px;">
          <h2 style="color: #3b82f6;">Newsletter Template</h2>
          <p>This is a simple newsletter template with a clean design.</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="color: #1e40af;">Main Article</h3>
            <p>Your main article content will go here. This is where you can share your most important news or updates.</p>
          </div>
          <div style="display: flex; gap: 15px; margin-top: 20px;">
            <div style="flex: 1; background-color: #f8fafc; padding: 15px; border-radius: 5px;">
              <h4 style="color: #1e40af;">Secondary Article</h4>
              <p>Additional content can go here.</p>
            </div>
            <div style="flex: 1; background-color: #f8fafc; padding: 15px; border-radius: 5px;">
              <h4 style="color: #1e40af;">Featured Item</h4>
              <p>Highlight a product or service here.</p>
            </div>
          </div>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
            <p>© 2023 Your Company. All rights reserved.</p>
            <p><a href="#" style="color: #3b82f6;">Unsubscribe</a> | <a href="#" style="color: #3b82f6;">View in browser</a></p>
          </div>
        </div>
      `;
      break;
    case 'template-2':
      templateContent = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 5px; background-color: #1e293b; color: #f8fafc;">
          <h2 style="color: #60a5fa;">Promotional Template</h2>
          <p>This is a promotional email template with a dark theme.</p>
          <div style="background-color: #334155; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="color: #93c5fd;">Special Offer</h3>
            <p>Highlight your special offer or promotion here. Make it compelling!</p>
            <a href="#" style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin-top: 10px;">Shop Now</a>
          </div>
          <div style="background-color: #334155; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="color: #93c5fd;">Featured Products</h3>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
              <div style="flex: 1; text-align: center;">
                <div style="background-color: #475569; height: 100px; border-radius: 5px; margin-bottom: 10px;"></div>
                <p>Product 1</p>
              </div>
              <div style="flex: 1; text-align: center;">
                <div style="background-color: #475569; height: 100px; border-radius: 5px; margin-bottom: 10px;"></div>
                <p>Product 2</p>
              </div>
              <div style="flex: 1; text-align: center;">
                <div style="background-color: #475569; height: 100px; border-radius: 5px; margin-bottom: 10px;"></div>
                <p>Product 3</p>
              </div>
            </div>
          </div>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #334155; text-align: center; font-size: 12px; color: #94a3b8;">
            <p>© 2023 Your Company. All rights reserved.</p>
            <p><a href="#" style="color: #60a5fa;">Unsubscribe</a> | <a href="#" style="color: #60a5fa;">View in browser</a></p>
          </div>
        </div>
      `;
      break;
    case 'template-3':
      templateContent = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 5px;">
          <h2 style="color: #059669;">Announcement Template</h2>
          <p>This is an announcement email template with a clean design.</p>
          <div style="background-color: #ecfdf5; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #059669;">
            <h3 style="color: #065f46;">Important Announcement</h3>
            <p>Your important announcement or news will go here. Make it clear and concise.</p>
          </div>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="color: #065f46;">Details</h3>
            <ul style="padding-left: 20px;">
              <li>Key point 1 about the announcement</li>
              <li>Key point 2 about the announcement</li>
              <li>Key point 3 about the announcement</li>
            </ul>
          </div>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 15px 0; text-align: center;">
            <h3 style="color: #065f46;">Next Steps</h3>
            <p>Explain what the recipient should do next, if applicable.</p>
            <a href="#" style="display: inline-block; background-color: #059669; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin-top: 10px;">Take Action</a>
          </div>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
            <p>© 2023 Your Company. All rights reserved.</p>
            <p><a href="#" style="color: #059669;">Unsubscribe</a> | <a href="#" style="color: #059669;">View in browser</a></p>
          </div>
        </div>
      `;
      break;
    default:
      templateContent = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 5px; text-align: center;">
          <h2 style="color: #3b82f6;">Select a Template</h2>
          <p>Please select an email template from the dropdown to preview it here.</p>
        </div>
      `;
  }

  templatePreview.innerHTML = templateContent;
}

// Simulate sending a campaign
async function simulateSendingCampaign(campaignId) {
  try {
    // Get campaigns from IndexedDB
    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
    let campaigns = await idbKeyval.get('email_campaigns', dbPromise) || [];

    // Find the campaign
    const campaignIndex = campaigns.findIndex(campaign => campaign.id === campaignId);

    if (campaignIndex === -1) {
      console.error('Campaign not found:', campaignId);
      return;
    }

    // Update campaign status
    campaigns[campaignIndex].status = 'sending';
    await idbKeyval.set('email_campaigns', campaigns, dbPromise);

    // Reload campaigns
    await loadEmailCampaigns();

    // Simulate sending process
    setTimeout(async () => {
      // Get campaigns again (in case they've changed)
      campaigns = await idbKeyval.get('email_campaigns', dbPromise) || [];

      // Find the campaign again
      const updatedCampaignIndex = campaigns.findIndex(campaign => campaign.id === campaignId);

      if (updatedCampaignIndex === -1) {
        console.error('Campaign not found during sending simulation:', campaignId);
        return;
      }

      // Generate random stats
      const recipientCount = Math.floor(Math.random() * 500) + 100; // 100-600 recipients
      const openedCount = Math.floor(recipientCount * (Math.random() * 0.5 + 0.3)); // 30-80% open rate
      const clickedCount = Math.floor(openedCount * (Math.random() * 0.4 + 0.1)); // 10-50% click rate
      const bouncedCount = Math.floor(recipientCount * (Math.random() * 0.05)); // 0-5% bounce rate
      const unsubscribedCount = Math.floor(recipientCount * (Math.random() * 0.02)); // 0-2% unsubscribe rate

      // Update campaign status and stats
      campaigns[updatedCampaignIndex].status = 'sent';
      campaigns[updatedCampaignIndex].stats = {
        sent: recipientCount,
        opened: openedCount,
        clicked: clickedCount,
        bounced: bouncedCount,
        unsubscribed: unsubscribedCount
      };

      await idbKeyval.set('email_campaigns', campaigns, dbPromise);

      // Reload campaigns
      await loadEmailCampaigns();

      // Add to timeline
      if (window.LeewayAIFeatures && typeof window.LeewayAIFeatures.addToTimeline === 'function') {
        await window.LeewayAIFeatures.addToTimeline({
          type: 'email',
          title: 'Email Campaign Sent',
          description: `Sent email campaign "${campaigns[updatedCampaignIndex].name}" to ${recipientCount} recipients.`,
          related: 'Email Campaigns',
          subtype: 'Campaign Sent'
        });
      }
    }, 3000); // Simulate 3 seconds of sending time
  } catch (error) {
    console.error('Error simulating campaign sending:', error);
  }
}

// Export the functions
window.EmailCampaignScheduler = {
  initialize: initializeEmailCampaignScheduler,
  loadEmailCampaigns,
  filterEmailCampaigns,
  viewCampaignDetails,
  duplicateCampaign,
  deleteCampaign,
  previewEmailTemplate,
  simulateSendingCampaign
};
