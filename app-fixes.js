/**
 * Agent Lee CRM System - Application Fixes
 *
 * This file contains fixes for various issues in the CRM application:
 * - Missing initialization functions
 * - Non-functioning buttons
 * - Missing UI elements
 * - Integration issues between modules
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Loading application fixes...');

  // Wait for all scripts to load
  setTimeout(function() {
    // Fix initialization functions
    fixInitializationFunctions();

    // Fix button event listeners
    fixButtonEventListeners();

    // Fix UI elements
    fixUIElements();

    // Fix integration issues
    fixIntegrationIssues();

    console.log('Application fixes applied successfully');
  }, 1000);
});

/**
 * Fix missing or incomplete initialization functions
 */
function fixInitializationFunctions() {
  console.log('Fixing initialization functions...');

  // Fix voice dictation initialization
  if (typeof initializeVoiceDictation !== 'function') {
    window.initializeVoiceDictation = function() {
      console.log('Initializing voice dictation system...');

      // Get UI elements
      const startDictationBtn = document.getElementById('start-dictation');
      const stopDictationBtn = document.getElementById('stop-dictation');
      const dictationResult = document.getElementById('dictation-result');
      const dictationStatus = document.getElementById('dictation-status');

      // Check if LeewayTech.Voice is available
      if (!window.LeewayTech || !window.LeewayTech.Voice) {
        console.error('LeewayTech.Voice module not available');
        if (dictationStatus) {
          dictationStatus.textContent = 'Voice dictation not available';
          dictationStatus.classList.add('text-red-500');
        }
        return;
      }

      // Initialize Web Speech API
      const initResult = window.LeewayTech.Voice.initDictation({
        onStart: function() {
          console.log('Voice dictation started');
          if (dictationStatus) {
            dictationStatus.textContent = 'Listening...';
            dictationStatus.classList.remove('text-red-500');
            dictationStatus.classList.add('text-green-500');
          }
          if (startDictationBtn) startDictationBtn.disabled = true;
          if (stopDictationBtn) stopDictationBtn.disabled = false;
        },
        onResult: function(text) {
          console.log('Interim result:', text);
          if (dictationResult) dictationResult.textContent = text;
        },
        onFinalResult: function(text) {
          console.log('Final result:', text);
          if (dictationResult) dictationResult.textContent = text;
        },
        onError: function(error) {
          console.error('Voice dictation error:', error);
          if (dictationStatus) {
            dictationStatus.textContent = 'Error: ' + error;
            dictationStatus.classList.remove('text-green-500');
            dictationStatus.classList.add('text-red-500');
          }
          if (startDictationBtn) startDictationBtn.disabled = false;
          if (stopDictationBtn) stopDictationBtn.disabled = true;
        },
        onEnd: function() {
          console.log('Voice dictation ended');
          if (dictationStatus) {
            dictationStatus.textContent = 'Ready';
            dictationStatus.classList.remove('text-green-500');
          }
          if (startDictationBtn) startDictationBtn.disabled = false;
          if (stopDictationBtn) stopDictationBtn.disabled = true;
        }
      });

      // Add event listeners to buttons
      if (startDictationBtn) {
        startDictationBtn.addEventListener('click', function() {
          window.LeewayTech.Voice.startDictation();
        });
      }

      if (stopDictationBtn) {
        stopDictationBtn.addEventListener('click', function() {
          window.LeewayTech.Voice.stopDictation();
        });
      }

      console.log('Voice dictation system initialized:', initResult);
    };
  }

  // Fix campaigns system initialization
  if (typeof initializeCampaignsSystem !== 'function') {
    window.initializeCampaignsSystem = function() {
      console.log('Initializing campaigns system...');

      // Get UI elements
      const campaignForm = document.getElementById('campaign-form');
      const sendCampaignBtn = document.getElementById('send-campaign-btn');
      const campaignStatus = document.getElementById('campaign-status');

      // Check if LeewayTech.Campaigns is available
      if (!window.LeewayTech || !window.LeewayTech.Campaigns) {
        console.error('LeewayTech.Campaigns module not available');
        if (campaignStatus) {
          campaignStatus.textContent = 'Campaigns system not available';
          campaignStatus.classList.add('text-red-500');
        }
        return;
      }

      // Initialize EmailJS
      const userId = window.LeewayApiKeys ?
        window.LeewayApiKeys.getKey('emailjs') :
        window.env?.EMAILJS_USER_ID || '';

      const serviceId = window.LeewayApiKeys ?
        window.LeewayApiKeys.getKey('emailjs-service') :
        window.env?.EMAILJS_SERVICE_ID || '';

      const templateId = window.LeewayApiKeys ?
        window.LeewayApiKeys.getKey('emailjs-template') :
        window.env?.EMAILJS_TEMPLATE_ID || '';

      const initResult = window.LeewayTech.Campaigns.initEmailJS(
        userId,
        serviceId,
        templateId
      );

      // Add event listener to send campaign button
      if (sendCampaignBtn) {
        sendCampaignBtn.addEventListener('click', function() {
          if (!campaignForm) return;

          // Get form data
          const formData = new FormData(campaignForm);
          const campaign = {
            recipients: formData.get('recipients').split(',').map(email => email.trim()),
            subject: formData.get('subject'),
            body: formData.get('message'),
            fromName: formData.get('from-name') || 'Leonard Lee',
            replyTo: formData.get('reply-to') || 'leonard@leemusicdistribution.com'
          };

          // Validate campaign data
          if (!campaign.recipients.length || !campaign.subject || !campaign.body) {
            alert('Please fill in all required fields');
            return;
          }

          // Send campaign
          window.LeewayTech.Campaigns.sendCampaign(
            campaign,
            function(response) {
              console.log('Campaign sent successfully:', response);
              if (campaignStatus) {
                campaignStatus.textContent = 'Campaign sent successfully';
                campaignStatus.classList.remove('text-red-500');
                campaignStatus.classList.add('text-green-500');
              }
              if (campaignForm) campaignForm.reset();
            },
            function(error) {
              console.error('Error sending campaign:', error);
              if (campaignStatus) {
                campaignStatus.textContent = 'Error sending campaign: ' + error;
                campaignStatus.classList.remove('text-green-500');
                campaignStatus.classList.add('text-red-500');
              }
            }
          );
        });
      }

      console.log('Campaigns system initialized:', initResult);
    };
  }

  // Fix analytics system initialization
  if (typeof initializeAnalyticsSystem !== 'function') {
    window.initializeAnalyticsSystem = function() {
      console.log('Initializing analytics system...');

      // Check if LeewayAnalytics is available
      if (!window.LeewayAnalytics) {
        console.error('LeewayAnalytics module not available');
        return;
      }

      // Get tracking ID
      const gaTrackingId = window.LeewayApiKeys ?
        window.LeewayApiKeys.getKey('google-analytics') :
        window.env?.GA_TRACKING_ID || '';

      // Initialize analytics
      window.LeewayAnalytics.init({
        gaTrackingId: gaTrackingId
      }).then(function(result) {
        console.log('Analytics system initialized:', result);

        // Create charts if analytics tab is active
        if (!document.getElementById('analytics-tab')?.classList.contains('hidden')) {
          createAnalyticsCharts();
        }
      });

      // Add event listener to analytics tab buttons
      document.querySelectorAll('[data-tab="analytics"]').forEach(function(btn) {
        btn.addEventListener('click', createAnalyticsCharts);
      });
    };
  }

  // Fix visits system initialization
  if (typeof initializeVisitsSystem !== 'function') {
    window.initializeVisitsSystem = function() {
      console.log('Initializing visits system...');

      // Get UI elements
      const logVisitBtn = document.getElementById('log-visit-btn');
      const visitForm = document.getElementById('visit-form');
      const visitStatus = document.getElementById('visit-status');

      // Check if LeewayMapping is available
      if (!window.LeewayMapping) {
        console.error('LeewayMapping module not available');
        if (visitStatus) {
          visitStatus.textContent = 'Visits system not available';
          visitStatus.classList.add('text-red-500');
        }
        return;
      }

      // Get API key
      const mapsApiKey = window.LeewayApiKeys ?
        window.LeewayApiKeys.getKey('google-maps') :
        window.env?.GOOGLE_MAPS_API_KEY || '';

      // Initialize mapping
      window.LeewayMapping.init({
        apiKey: mapsApiKey,
        mapElementId: 'map',
        useGeolocation: true
      }).then(function(result) {
        console.log('Mapping system initialized:', result);
      });

      // Add event listener to log visit button
      if (logVisitBtn && visitForm) {
        logVisitBtn.addEventListener('click', function() {
          // Get form data
          const formData = new FormData(visitForm);
          const visit = {
            store: formData.get('store'),
            date: formData.get('date'),
            time: formData.get('time'),
            notes: formData.get('notes'),
            location: formData.get('location')
          };

          // Validate visit data
          if (!visit.store || !visit.date) {
            alert('Please fill in all required fields');
            return;
          }

          // Save visit to IndexedDB
          saveVisit(visit).then(function() {
            console.log('Visit logged successfully');
            if (visitStatus) {
              visitStatus.textContent = 'Visit logged successfully';
              visitStatus.classList.remove('text-red-500');
              visitStatus.classList.add('text-green-500');
            }
            visitForm.reset();
          }).catch(function(error) {
            console.error('Error logging visit:', error);
            if (visitStatus) {
              visitStatus.textContent = 'Error logging visit: ' + error;
              visitStatus.classList.remove('text-green-500');
              visitStatus.classList.add('text-red-500');
            }
          });
        });
      }
    };
  }

  // Helper function to save visit to IndexedDB
  async function saveVisit(visit) {
    if (typeof idbKeyval === 'undefined') {
      throw new Error('idb-keyval library not loaded');
    }

    const dbPromise = idbKeyval.createStore('agent-lee-crm', 'visits-store');

    // Get existing visits
    const visits = await idbKeyval.get('visits', dbPromise) || [];

    // Add new visit
    visits.push({
      ...visit,
      id: Date.now(),
      timestamp: new Date().toISOString()
    });

    // Save visits
    await idbKeyval.set('visits', visits, dbPromise);

    return true;
  }

  // Helper function to create analytics charts
  function createAnalyticsCharts() {
    console.log('Creating analytics charts...');

    // Check if LeewayAnalytics is available
    if (!window.LeewayAnalytics) {
      console.error('LeewayAnalytics module not available');
      return;
    }

    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
      console.error('Chart.js not loaded');
      return;
    }

    // Sample data for charts
    const campaignsData = [
      { title: 'Spring Sale', openRate: 45.2, clickRate: 12.5, responseRate: 5.8 },
      { title: 'Summer Promotion', openRate: 52.7, clickRate: 18.3, responseRate: 7.2 },
      { title: 'Fall Collection', openRate: 38.9, clickRate: 10.1, responseRate: 4.5 },
      { title: 'Holiday Special', openRate: 61.3, clickRate: 22.7, responseRate: 9.1 }
    ];

    // Create campaign performance chart
    const campaignChartCanvas = document.getElementById('campaign-performance-chart');
    if (campaignChartCanvas) {
      window.LeewayAnalytics.createCampaignPerformanceChart('campaign-performance-chart', campaignsData);
    }

    // Create geographic distribution chart
    const geoChartCanvas = document.getElementById('geographic-distribution-chart');
    if (geoChartCanvas) {
      const geoData = {
        'Wisconsin': 45,
        'Illinois': 28,
        'Minnesota': 15,
        'Michigan': 12
      };

      window.LeewayAnalytics.createGeographicDistributionChart('geographic-distribution-chart', geoData);
    }
  }
}

/**
 * Fix button event listeners
 */
function fixButtonEventListeners() {
  console.log('Fixing button event listeners...');

  // Fix tab switching buttons
  document.querySelectorAll('[data-tab]').forEach(function(button) {
    // Remove existing event listeners
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);

    // Add new event listener
    newButton.addEventListener('click', function() {
      const tabName = this.dataset.tab;
      activateTab(tabName);
    });
  });

  // Fix mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileSidebar = document.getElementById('mobile-sidebar');

  if (mobileMenuToggle && mobileSidebar) {
    // Remove existing event listeners
    const newToggle = mobileMenuToggle.cloneNode(true);
    mobileMenuToggle.parentNode.replaceChild(newToggle, mobileMenuToggle);

    // Add new event listener
    newToggle.addEventListener('click', function() {
      mobileSidebar.classList.toggle('-translate-x-full');
    });
  }
}

/**
 * Fix UI elements
 */
function fixUIElements() {
  console.log('Fixing UI elements...');

  // Fix missing campaign form
  const campaignTab = document.getElementById('campaigns-tab');
  if (campaignTab && !document.getElementById('campaign-form')) {
    const campaignFormHtml = `
      <form id="campaign-form" class="space-y-4 mt-4">
        <div>
          <label for="recipients" class="block text-sm font-medium text-dark-700 dark:text-dark-300">Recipients (comma-separated)</label>
          <input type="text" id="recipients" name="recipients" class="mt-1 block w-full rounded-md border-dark-300 dark:border-dark-700 dark:bg-dark-800 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
        </div>
        <div>
          <label for="subject" class="block text-sm font-medium text-dark-700 dark:text-dark-300">Subject</label>
          <input type="text" id="subject" name="subject" class="mt-1 block w-full rounded-md border-dark-300 dark:border-dark-700 dark:bg-dark-800 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
        </div>
        <div>
          <label for="message" class="block text-sm font-medium text-dark-700 dark:text-dark-300">Message</label>
          <textarea id="message" name="message" rows="6" class="mt-1 block w-full rounded-md border-dark-300 dark:border-dark-700 dark:bg-dark-800 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="from-name" class="block text-sm font-medium text-dark-700 dark:text-dark-300">From Name</label>
            <input type="text" id="from-name" name="from-name" value="Leonard Lee" class="mt-1 block w-full rounded-md border-dark-300 dark:border-dark-700 dark:bg-dark-800 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
          </div>
          <div>
            <label for="reply-to" class="block text-sm font-medium text-dark-700 dark:text-dark-300">Reply To</label>
            <input type="email" id="reply-to" name="reply-to" value="leonard@leemusicdistribution.com" class="mt-1 block w-full rounded-md border-dark-300 dark:border-dark-700 dark:bg-dark-800 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
          </div>
        </div>
        <div class="flex justify-between items-center">
          <button type="button" id="campaign-dictation-btn" class="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Dictate
          </button>
          <button type="button" id="send-campaign-btn" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send Campaign
          </button>
        </div>
        <div id="campaign-status" class="mt-2"></div>
      </form>
    `;

    campaignTab.insertAdjacentHTML('beforeend', campaignFormHtml);
  }

  // Fix missing voice dictation UI
  const voiceTab = document.getElementById('voice-tab');
  if (voiceTab && !document.getElementById('dictation-controls')) {
    const voiceDictationHtml = `
      <div id="dictation-controls" class="mt-4 p-4 bg-white dark:bg-dark-800 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-2">Voice Dictation</h3>
        <div class="flex space-x-2 mb-4">
          <button id="start-dictation" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Start Dictation
          </button>
          <button id="stop-dictation" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
            Stop Dictation
          </button>
        </div>
        <div class="mb-2">
          <span class="text-sm font-medium">Status: </span>
          <span id="dictation-status" class="text-sm">Ready</span>
        </div>
        <div class="p-4 bg-gray-100 dark:bg-dark-700 rounded-md min-h-[100px] mb-4">
          <p id="dictation-result" class="whitespace-pre-wrap"></p>
        </div>
        <div class="flex justify-end">
          <button id="dictation-process" class="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Process Dictation
          </button>
        </div>
      </div>
    `;

    voiceTab.insertAdjacentHTML('beforeend', voiceDictationHtml);
  }
}

/**
 * Fix integration issues between modules
 */
function fixIntegrationIssues() {
  console.log('Fixing integration issues...');

  // Fix integration between voice dictation and campaigns
  const campaignDictationBtn = document.getElementById('campaign-dictation-btn');
  if (campaignDictationBtn && window.LeewayTech?.Voice) {
    // Remove existing event listeners
    const newBtn = campaignDictationBtn.cloneNode(true);
    campaignDictationBtn.parentNode.replaceChild(newBtn, campaignDictationBtn);

    // Add new event listener
    newBtn.addEventListener('click', function() {
      const statusElement = document.createElement('div');
      statusElement.id = 'campaign-dictation-status';
      statusElement.className = 'mt-2 text-sm';
      this.parentNode.appendChild(statusElement);

      // Initialize dictation
      window.LeewayTech.Voice.initDictation({
        onStart: function() {
          statusElement.textContent = 'Listening...';
          newBtn.classList.add('bg-red-500');
          newBtn.classList.remove('bg-secondary');
        },
        onResult: function(text) {
          statusElement.textContent = text;
        },
        onFinalResult: function(text) {
          // Fill campaign form with dictated text
          const messageField = document.getElementById('message');
          if (messageField) {
            messageField.value = text;
          }

          // Stop dictation
          window.LeewayTech.Voice.stopDictation();
          newBtn.classList.remove('bg-red-500');
          newBtn.classList.add('bg-secondary');

          // Provide feedback
          window.LeewayTech.Voice.speak('Campaign content recorded.');
        },
        onError: function(error) {
          statusElement.textContent = `Error: ${error}`;
          newBtn.classList.remove('bg-red-500');
          newBtn.classList.add('bg-secondary');
        },
        onEnd: function() {
          statusElement.textContent = 'Dictation ended';
          newBtn.classList.remove('bg-red-500');
          newBtn.classList.add('bg-secondary');
        }
      });

      window.LeewayTech.Voice.startDictation();
    });
  }
}

/**
 * Helper function to activate a tab
 * @param {string} tabName - Name of the tab to activate
 */
function activateTab(tabName) {
  console.log('Activating tab:', tabName);

  // Get all tab contents
  const tabContents = document.querySelectorAll('section[id$="-tab"]');

  // Hide all tab contents
  tabContents.forEach(function(content) {
    content.classList.add('hidden');
  });

  // Show the selected tab content
  const selectedTab = document.getElementById(tabName + '-tab');
  if (selectedTab) {
    selectedTab.classList.remove('hidden');
  }

  // Update active tab buttons
  document.querySelectorAll('[data-tab]').forEach(function(button) {
    if (button.dataset.tab === tabName) {
      if (button.classList.contains('sidebar-nav-item') || button.classList.contains('mobile-nav-item')) {
        button.classList.add('bg-primary-50', 'dark:bg-primary-900/20', 'text-primary', 'font-medium');
        button.classList.remove('text-dark-700', 'dark:text-dark-300', 'hover:bg-dark-100', 'dark:hover:bg-dark-700/50');
      } else {
        button.classList.add('tab-active');
        button.classList.remove('text-dark-500', 'dark:text-dark-400');
      }
    } else {
      if (button.classList.contains('sidebar-nav-item') || button.classList.contains('mobile-nav-item')) {
        button.classList.remove('bg-primary-50', 'dark:bg-primary-900/20', 'text-primary', 'font-medium');
        button.classList.add('text-dark-700', 'dark:text-dark-300', 'hover:bg-dark-100', 'dark:hover:bg-dark-700/50');
      } else {
        button.classList.remove('tab-active');
        button.classList.add('text-dark-500', 'dark:text-dark-400');
      }
    }
  });

  // Load tab-specific data
  if (tabName === 'dashboard') {
    if (typeof loadDashboardData === 'function') {
      loadDashboardData();
    }
  } else if (tabName === 'analytics') {
    createAnalyticsCharts();
  } else if (tabName === 'business-card') {
    if (typeof initializeBusinessCardMap === 'function') {
      initializeBusinessCardMap();
    }
    // Initialize business card tab functionality
    if (window.BusinessCardTab && typeof window.BusinessCardTab.initialize === 'function') {
      window.BusinessCardTab.initialize();
    }
  }
}
