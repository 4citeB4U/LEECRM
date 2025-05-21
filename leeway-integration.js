/**
 * LEEWAY™ Technologies Integration
 *
 * This file integrates all LEEWAY™ compatible technologies:
 * - Voice dictation (Web Speech API)
 * - Campaign sending (EmailJS)
 * - SEO tools
 * - Analytics (Chart.js)
 * - Mapping (Google Maps)
 * - AI integration (Google Gemini)
 */

// ======================================================
// Main Integration Module
// ======================================================

const LeewayIntegration = {
  /**
   * Initialize all LEEWAY™ technologies
   * @param {Object} config - Configuration object
   * @returns {Promise<Object>} Initialization results
   */
  init: async function(config = {}) {
    console.log('Initializing LEEWAY™ technologies...');

    // Results object to track initialization status
    const results = {
      voice: false,
      campaigns: false,
      analytics: false,
      mapping: false,
      ai: false,
      overall: false
    };

    try {
      // 1. Initialize Voice module
      if (window.LeewayTech && window.LeewayTech.Voice) {
        results.voice = window.LeewayTech.Voice.initDictation({
          onError: (error) => console.error('Voice dictation error:', error)
        });

        if (results.voice) {
          window.LeewayTech.Voice.initSpeechSynthesis();
          console.log('Voice module initialized successfully');
        }
      }

      // 2. Initialize Campaigns module
      if (window.LeewayTech && window.LeewayTech.Campaigns) {
        // Get API keys securely
        const emailjsUserId = window.LeewayApiKeys ?
          window.LeewayApiKeys.getKey('emailjs') :
          config.emailjs?.userId;

        const emailjsServiceId = window.LeewayApiKeys ?
          window.LeewayApiKeys.getKey('emailjs-service') :
          config.emailjs?.serviceId;

        const emailjsTemplateId = window.LeewayApiKeys ?
          window.LeewayApiKeys.getKey('emailjs-template') :
          config.emailjs?.templateId;

        results.campaigns = window.LeewayTech.Campaigns.initEmailJS(
          emailjsUserId,
          emailjsServiceId,
          emailjsTemplateId
        );

        if (results.campaigns) {
          console.log('Campaigns module initialized successfully');
        }
      }

      // 3. Initialize Analytics module
      if (window.LeewayAnalytics) {
        // Get API key securely
        const gaTrackingId = window.LeewayApiKeys ?
          window.LeewayApiKeys.getKey('google-analytics') :
          config.analytics?.gaTrackingId;

        results.analytics = await window.LeewayAnalytics.init({
          gaTrackingId: gaTrackingId
        });

        if (results.analytics) {
          console.log('Analytics module initialized successfully');
        }
      }

      // 4. Initialize Mapping module
      if (window.LeewayMapping) {
        // Get API key securely
        const mapsApiKey = window.LeewayApiKeys ?
          window.LeewayApiKeys.getKey('google-maps') :
          config.mapping?.apiKey;

        results.mapping = await window.LeewayMapping.init({
          apiKey: mapsApiKey,
          mapElementId: config.mapping?.mapElementId,
          useGeolocation: config.mapping?.useGeolocation,
          mapOptions: config.mapping?.mapOptions
        });

        if (results.mapping) {
          console.log('Mapping module initialized successfully');
        }
      }

      // 5. Initialize AI module
      if (window.LeewayAI) {
        // Get API keys securely
        const geminiApiKey = window.LeewayApiKeys ?
          window.LeewayApiKeys.getKey('gemini') :
          config.ai?.geminiApiKey;

        const openaiApiKey = window.LeewayApiKeys ?
          window.LeewayApiKeys.getKey('openai') :
          config.ai?.openaiApiKey;

        results.ai = await window.LeewayAI.init({
          defaultProvider: config.ai?.defaultProvider,
          apiKeys: {
            gemini: geminiApiKey,
            openai: openaiApiKey
          }
        });

        if (results.ai) {
          console.log('AI module initialized successfully');
        }
      }

      // Overall success if at least voice and one other module initialized
      results.overall = results.voice && (
        results.campaigns ||
        results.analytics ||
        results.mapping ||
        results.ai
      );

      if (results.overall) {
        console.log('LEEWAY™ technologies initialized successfully');
        this.setupIntegrations();
      } else {
        console.warn('Some LEEWAY™ technologies failed to initialize');
      }

      return results;
    } catch (error) {
      console.error('Error initializing LEEWAY™ technologies:', error);
      return results;
    }
  },

  /**
   * Set up integrations between different modules
   */
  setupIntegrations: function() {
    // 1. Voice dictation to campaign creation
    this.setupVoiceToCampaign();

    // 2. Voice dictation to AI processing
    this.setupVoiceToAI();

    // 3. Campaign analytics integration
    this.setupCampaignAnalytics();

    // 4. Location tracking for visits
    this.setupLocationTracking();

    // 5. SEO analysis for campaigns
    this.setupSEOAnalysis();

    console.log('LEEWAY™ technology integrations set up successfully');
  },

  /**
   * Set up integration between voice dictation and campaign creation
   */
  setupVoiceToCampaign: function() {
    if (!window.LeewayTech?.Voice || !window.LeewayTech?.Campaigns) return;

    // Add event listener for campaign dictation button
    const campaignDictationBtn = document.getElementById('campaign-dictation-btn');
    if (campaignDictationBtn) {
      campaignDictationBtn.addEventListener('click', () => {
        const statusElement = document.getElementById('campaign-dictation-status');

        // Start dictation
        window.LeewayTech.Voice.initDictation({
          onStart: () => {
            if (statusElement) statusElement.textContent = 'Listening...';
            campaignDictationBtn.classList.add('recording');
          },
          onResult: (text) => {
            if (statusElement) statusElement.textContent = text;
          },
          onFinalResult: (text) => {
            // Fill campaign form with dictated text
            const messageField = document.getElementById('campaign-message');
            if (messageField) {
              messageField.value = text;
            }

            // Stop dictation
            window.LeewayTech.Voice.stopDictation();
            campaignDictationBtn.classList.remove('recording');

            // Provide feedback
            window.LeewayTech.Voice.speak('Campaign content recorded.');
          },
          onError: (error) => {
            if (statusElement) statusElement.textContent = `Error: ${error}`;
            campaignDictationBtn.classList.remove('recording');
          },
          onEnd: () => {
            if (statusElement) statusElement.textContent = 'Dictation ended';
            campaignDictationBtn.classList.remove('recording');
          }
        });

        window.LeewayTech.Voice.startDictation();
      });
    }
  },

  /**
   * Set up integration between voice dictation and AI processing
   */
  setupVoiceToAI: function() {
    if (!window.LeewayTech?.Voice || !window.LeewayAI) return;

    // Add event listener for AI assistant button
    const aiAssistantBtn = document.getElementById('ai-assistant-btn');
    if (aiAssistantBtn) {
      aiAssistantBtn.addEventListener('click', () => {
        const statusElement = document.getElementById('ai-assistant-status');
        const responseElement = document.getElementById('ai-assistant-response');

        // Start dictation
        window.LeewayTech.Voice.initDictation({
          onStart: () => {
            if (statusElement) statusElement.textContent = 'Listening...';
            aiAssistantBtn.classList.add('recording');
          },
          onResult: (text) => {
            if (statusElement) statusElement.textContent = text;
          },
          onFinalResult: async (text) => {
            // Stop dictation
            window.LeewayTech.Voice.stopDictation();
            aiAssistantBtn.classList.remove('recording');

            if (statusElement) statusElement.textContent = 'Processing...';

            try {
              // Process with AI
              const response = await window.LeewayAI.generateText(text);

              // Display response
              if (responseElement) {
                responseElement.textContent = response;
              }

              // Speak response
              window.LeewayTech.Voice.speak(response);

              if (statusElement) statusElement.textContent = 'Done';
            } catch (error) {
              console.error('Error processing AI request:', error);
              if (statusElement) statusElement.textContent = `Error: ${error.message}`;
            }
          },
          onError: (error) => {
            if (statusElement) statusElement.textContent = `Error: ${error}`;
            aiAssistantBtn.classList.remove('recording');
          },
          onEnd: () => {
            if (!statusElement.textContent.includes('Processing')) {
              statusElement.textContent = 'Dictation ended';
            }
            aiAssistantBtn.classList.remove('recording');
          }
        });

        window.LeewayTech.Voice.startDictation();
      });
    }
  },

  /**
   * Set up campaign analytics integration
   */
  setupCampaignAnalytics: function() {
    if (!window.LeewayAnalytics) return;

    // Track campaign creation events
    const createCampaignBtn = document.getElementById('create-campaign-btn');
    if (createCampaignBtn) {
      createCampaignBtn.addEventListener('click', () => {
        window.LeewayAnalytics.trackEvent('Campaign', 'create', 'Campaign Creation', 1);
      });
    }

    // Track campaign sending events
    const sendCampaignBtn = document.getElementById('send-campaign-btn');
    if (sendCampaignBtn) {
      sendCampaignBtn.addEventListener('click', () => {
        window.LeewayAnalytics.trackEvent('Campaign', 'send', 'Campaign Sending', 1);
      });
    }

    // Create campaign performance chart
    const campaignChartCanvas = document.getElementById('campaign-performance-chart');
    if (campaignChartCanvas) {
      // This will be populated with actual campaign data
      const loadCampaignData = async () => {
        try {
          const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
          const campaigns = await idbKeyval.get('campaigns', dbPromise) || [];

          // Create chart with campaign data
          window.LeewayAnalytics.createCampaignPerformanceChart('campaign-performance-chart', campaigns);
        } catch (error) {
          console.error('Error loading campaign data for chart:', error);
        }
      };

      loadCampaignData();
    }
  },

  /**
   * Set up location tracking for visits
   */
  setupLocationTracking: function() {
    if (!window.LeewayMapping) return;

    // Track location when logging a visit
    const logVisitBtn = document.getElementById('log-visit-btn');
    if (logVisitBtn) {
      logVisitBtn.addEventListener('click', async () => {
        try {
          // Get current location
          const currentLocation = window.LeewayMapping.currentLocation;

          if (currentLocation) {
            // Add location to visit form
            const locationInput = document.getElementById('visit-location');
            if (locationInput) {
              // Reverse geocode to get address
              try {
                const address = await window.LeewayMapping.geocodeAddress(
                  `${currentLocation.lat},${currentLocation.lng}`
                );
                locationInput.value = address.formattedAddress;
              } catch (error) {
                console.error('Error geocoding location:', error);
                locationInput.value = `${currentLocation.lat}, ${currentLocation.lng}`;
              }
            }
          }
        } catch (error) {
          console.error('Error getting location for visit:', error);
        }
      });
    }
  },

  /**
   * Set up SEO analysis for campaigns
   */
  setupSEOAnalysis: function() {
    if (!window.LeewayTech?.SEO || !window.LeewayAI) return;

    // Add SEO analysis button to campaign form
    const campaignForm = document.getElementById('campaign-form');
    if (campaignForm) {
      const analyzeBtn = document.createElement('button');
      analyzeBtn.type = 'button';
      analyzeBtn.id = 'analyze-seo-btn';
      analyzeBtn.className = 'px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors';
      analyzeBtn.textContent = 'Analyze SEO';

      // Add button to form
      const buttonContainer = campaignForm.querySelector('.form-actions') || campaignForm;
      buttonContainer.appendChild(analyzeBtn);

      // Add event listener
      analyzeBtn.addEventListener('click', async () => {
        const messageField = document.getElementById('campaign-message');
        const keywordField = document.getElementById('campaign-keyword');

        if (!messageField || !keywordField) return;

        const content = messageField.value;
        const keyword = keywordField.value;

        if (!content || !keyword) {
          alert('Please enter campaign content and a target keyword');
          return;
        }

        try {
          // Show loading state
          analyzeBtn.textContent = 'Analyzing...';
          analyzeBtn.disabled = true;

          // Basic SEO analysis
          const basicAnalysis = window.LeewayTech.SEO.analyzeContent(content, keyword);

          // Advanced AI-powered analysis
          const aiAnalysis = await window.LeewayAI.generateSEORecommendations(content, keyword);

          // Display results
          this.displaySEOAnalysisResults(basicAnalysis, aiAnalysis);
        } catch (error) {
          console.error('Error analyzing SEO:', error);
          alert('Error analyzing SEO. Please try again.');
        } finally {
          // Reset button
          analyzeBtn.textContent = 'Analyze SEO';
          analyzeBtn.disabled = false;
        }
      });
    }
  },

  /**
   * Display SEO analysis results
   * @param {Object} basicAnalysis - Basic SEO analysis results
   * @param {Object} aiAnalysis - AI-powered SEO analysis results
   */
  displaySEOAnalysisResults: function(basicAnalysis, aiAnalysis) {
    // Create or get results container
    let resultsContainer = document.getElementById('seo-analysis-results');

    if (!resultsContainer) {
      resultsContainer = document.createElement('div');
      resultsContainer.id = 'seo-analysis-results';
      resultsContainer.className = 'mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md';

      // Add to page
      const campaignForm = document.getElementById('campaign-form');
      if (campaignForm) {
        campaignForm.appendChild(resultsContainer);
      }
    }

    // Create results HTML
    let resultsHTML = `
      <h3 class="text-lg font-semibold mb-2">SEO Analysis Results</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 class="font-medium">Basic Analysis</h4>
          <ul class="list-disc pl-5 mt-2">
            <li>Keyword count: ${basicAnalysis.keywordCount}</li>
            <li>Keyword density: ${basicAnalysis.keywordDensity}%</li>
            <li>Content length: ${basicAnalysis.contentLength} characters</li>
            <li>Keyword in first paragraph: ${basicAnalysis.keywordInFirstParagraph ? 'Yes' : 'No'}</li>
            <li>Readability score: ${Math.round(basicAnalysis.readabilityScore)}</li>
          </ul>
        </div>
        <div>
          <h4 class="font-medium">AI Recommendations</h4>
          <p class="mt-2">Overall score: ${aiAnalysis.score}/100</p>
          <ul class="list-disc pl-5 mt-2">
    `;

    // Add AI recommendations
    aiAnalysis.recommendations.forEach(rec => {
      resultsHTML += `<li><strong>${rec.type}:</strong> ${rec.suggestion}</li>`;
    });

    resultsHTML += `
          </ul>
        </div>
      </div>
    `;

    // Update results container
    resultsContainer.innerHTML = resultsHTML;
  }
};

// Export integration module
window.LeewayIntegration = LeewayIntegration;
