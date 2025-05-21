/**
 * LEEWAY™ Compatible AI Integration
 *
 * This file implements AI technologies compatible with LEEWAY™ standards:
 * - Google Gemini API integration
 * - OpenAI API integration (optional fallback)
 * - Client-side AI processing
 * - Offline capabilities with local models
 */

// ======================================================
// 1. AI Integration Services
// ======================================================

const LeewayAI = {
  activeProvider: null,
  providers: {},

  /**
   * Initialize AI system
   * @param {Object} options - Configuration options
   * @param {string} options.defaultProvider - Default AI provider ('gemini', 'openai', 'local')
   * @param {Object} options.apiKeys - API keys for different providers
   * @returns {Promise<boolean>} Initialization success
   */
  init: async function(options = {}) {
    this.options = {
      defaultProvider: options.defaultProvider || 'gemini',
      apiKeys: options.apiKeys || {}
    };

    // Initialize providers
    let initSuccess = false;

    // Try to initialize the default provider
    if (this.options.defaultProvider === 'gemini' && this.options.apiKeys.gemini) {
      initSuccess = await this.initGemini(this.options.apiKeys.gemini);
      if (initSuccess) {
        this.activeProvider = 'gemini';
      }
    } else if (this.options.defaultProvider === 'openai' && this.options.apiKeys.openai) {
      initSuccess = await this.initOpenAI(this.options.apiKeys.openai);
      if (initSuccess) {
        this.activeProvider = 'openai';
      }
    } else if (this.options.defaultProvider === 'local') {
      initSuccess = await this.initLocalModel();
      if (initSuccess) {
        this.activeProvider = 'local';
      }
    }

    // If default provider failed, try fallbacks
    if (!initSuccess) {
      // Try Gemini as fallback
      if (this.options.defaultProvider !== 'gemini' && this.options.apiKeys.gemini) {
        initSuccess = await this.initGemini(this.options.apiKeys.gemini);
        if (initSuccess) {
          this.activeProvider = 'gemini';
        }
      }

      // Try OpenAI as fallback
      if (!initSuccess && this.options.defaultProvider !== 'openai' && this.options.apiKeys.openai) {
        initSuccess = await this.initOpenAI(this.options.apiKeys.openai);
        if (initSuccess) {
          this.activeProvider = 'openai';
        }
      }

      // Try local model as last resort
      if (!initSuccess && this.options.defaultProvider !== 'local') {
        initSuccess = await this.initLocalModel();
        if (initSuccess) {
          this.activeProvider = 'local';
        }
      }
    }

    if (!initSuccess) {
      console.error('Failed to initialize any AI provider');
      return false;
    }

    console.log(`AI system initialized with provider: ${this.activeProvider}`);
    return true;
  },

  /**
   * Initialize Google Gemini API
   * @param {string} apiKey - Gemini API key
   * @returns {Promise<boolean>} Initialization success
   */
  initGemini: async function(apiKey) {
    try {
      // Load Gemini API script if not already loaded
      if (typeof window.GeminiGenerativeAI === 'undefined') {
        await this.loadScript('https://cdn.jsdelivr.net/npm/@google/generative-ai@latest');
      }

      // Initialize Gemini
      const genAI = new window.GeminiGenerativeAI(apiKey);
      this.providers.gemini = {
        genAI,
        model: genAI.getGenerativeModel({ model: 'gemini-pro' })
      };

      console.log('Google Gemini API initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing Google Gemini API:', error);
      return false;
    }
  },

  /**
   * Initialize OpenAI API
   * @param {string} apiKey - OpenAI API key
   * @returns {Promise<boolean>} Initialization success
   */
  initOpenAI: async function(apiKey) {
    try {
      // Load OpenAI API script if not already loaded
      if (typeof window.OpenAI === 'undefined') {
        await this.loadScript('https://cdn.jsdelivr.net/npm/openai@latest/dist/openai.min.js');
      }

      // Initialize OpenAI
      const openai = new window.OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Note: This is for demo purposes only
      });

      this.providers.openai = {
        openai,
        model: 'gpt-3.5-turbo' // Default model
      };

      console.log('OpenAI API initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing OpenAI API:', error);
      return false;
    }
  },

  /**
   * Initialize local AI model
   * @returns {Promise<boolean>} Initialization success
   */
  initLocalModel: async function() {
    try {
      // Check if WebLLM is available
      if (typeof window.WebLLM === 'undefined') {
        await this.loadScript('https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@latest/dist/web-llm.js');
      }

      // Initialize WebLLM with a small model
      const webLLM = new window.WebLLM();
      await webLLM.loadModel('Phi-2');

      this.providers.local = {
        webLLM,
        model: 'Phi-2'
      };

      console.log('Local AI model initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing local AI model:', error);
      return false;
    }
  },

  /**
   * Load a script dynamically
   * @param {string} src - Script URL
   * @returns {Promise<void>} Promise that resolves when script is loaded
   */
  loadScript: function(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;

      script.onload = () => {
        console.log(`Script loaded: ${src}`);
        resolve();
      };

      script.onerror = () => {
        const error = new Error(`Failed to load script: ${src}`);
        console.error(error);
        reject(error);
      };

      document.head.appendChild(script);
    });
  },

  /**
   * Generate text using the active AI provider
   * @param {string} prompt - Text prompt
   * @param {Object} options - Generation options
   * @returns {Promise<string>} Generated text
   */
  generateText: async function(prompt, options = {}) {
    if (!this.activeProvider || !this.providers[this.activeProvider]) {
      throw new Error('No active AI provider');
    }

    try {
      // Check if we need to use chunking
      if (window.LeewayChunking && prompt.length > (options.chunkThreshold || 4000)) {
        console.log(`Prompt length (${prompt.length} chars) exceeds threshold, using chunking`);
        return await this.generateWithChunking(prompt, options);
      }

      // Standard generation without chunking
      switch (this.activeProvider) {
        case 'gemini':
          return await this.generateWithGemini(prompt, options);
        case 'openai':
          return await this.generateWithOpenAI(prompt, options);
        case 'local':
          return await this.generateWithLocalModel(prompt, options);
        default:
          throw new Error(`Unknown provider: ${this.activeProvider}`);
      }
    } catch (error) {
      console.error(`Error generating text with ${this.activeProvider}:`, error);

      // Try fallback if available
      if (this.activeProvider !== 'gemini' && this.providers.gemini) {
        console.log('Trying fallback to Gemini...');
        return await this.generateWithGemini(prompt, options);
      } else if (this.activeProvider !== 'openai' && this.providers.openai) {
        console.log('Trying fallback to OpenAI...');
        return await this.generateWithOpenAI(prompt, options);
      } else if (this.activeProvider !== 'local' && this.providers.local) {
        console.log('Trying fallback to local model...');
        return await this.generateWithLocalModel(prompt, options);
      }

      throw error;
    }
  },

  /**
   * Generate text using chunking for large inputs
   * @param {string} prompt - Text prompt
   * @param {Object} options - Generation options
   * @returns {Promise<string>} Generated text
   */
  generateWithChunking: async function(prompt, options = {}) {
    if (!window.LeewayChunking) {
      console.warn('LeewayChunking not available, falling back to standard generation');

      // Fall back to standard generation
      switch (this.activeProvider) {
        case 'gemini':
          return await this.generateWithGemini(prompt, options);
        case 'openai':
          return await this.generateWithOpenAI(prompt, options);
        case 'local':
          return await this.generateWithLocalModel(prompt, options);
        default:
          throw new Error(`Unknown provider: ${this.activeProvider}`);
      }
    }

    // Create a controller for chunking
    const controller = new window.LeewayChunking.AgenticController({
      maxChunkSize: options.maxChunkSize || 2000,
      aiProvider: this
    });

    // Extract instructions from the beginning of the prompt
    const instructionMatch = prompt.match(/^(.*?)\n\n([\s\S]*)$/);
    let instructions = '';
    let content = prompt;

    if (instructionMatch) {
      instructions = instructionMatch[1];
      content = instructionMatch[2];
    }

    // Execute chunking process
    return await controller.execute(content, async (chunk, index) => {
      // Create a prompt for each chunk
      const chunkPrompt = `${instructions}

${chunk}

${options.chunkInstructions || 'Process the above text.'}`;

      // Process with the active provider
      switch (this.activeProvider) {
        case 'gemini':
          return await this.generateWithGemini(chunkPrompt, options);
        case 'openai':
          return await this.generateWithOpenAI(chunkPrompt, options);
        case 'local':
          return await this.generateWithLocalModel(chunkPrompt, options);
        default:
          throw new Error(`Unknown provider: ${this.activeProvider}`);
      }
    });
  },

  /**
   * Generate text using Google Gemini
   * @param {string} prompt - Text prompt
   * @param {Object} options - Generation options
   * @returns {Promise<string>} Generated text
   */
  generateWithGemini: async function(prompt, options = {}) {
    const { model } = this.providers.gemini;

    const generationConfig = {
      temperature: options.temperature || 0.7,
      topK: options.topK || 40,
      topP: options.topP || 0.95,
      maxOutputTokens: options.maxTokens || 1024
    };

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig
    });

    return result.response.text();
  },

  /**
   * Generate text using OpenAI
   * @param {string} prompt - Text prompt
   * @param {Object} options - Generation options
   * @returns {Promise<string>} Generated text
   */
  generateWithOpenAI: async function(prompt, options = {}) {
    const { openai } = this.providers.openai;

    const completion = await openai.chat.completions.create({
      model: options.model || this.providers.openai.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1024,
      top_p: options.topP || 0.95
    });

    return completion.choices[0].message.content;
  },

  /**
   * Generate text using local model
   * @param {string} prompt - Text prompt
   * @param {Object} options - Generation options
   * @returns {Promise<string>} Generated text
   */
  generateWithLocalModel: async function(prompt, options = {}) {
    const { webLLM } = this.providers.local;

    const result = await webLLM.chat(prompt, {
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1024
    });

    return result.text;
  },

  /**
   * Analyze sentiment of text
   * @param {string} text - Text to analyze
   * @returns {Promise<Object>} Sentiment analysis result
   */
  analyzeSentiment: async function(text) {
    const prompt = `Analyze the sentiment of the following text and respond with only one word: "positive", "negative", or "neutral".\n\nText: "${text}"`;

    const sentiment = await this.generateText(prompt, { temperature: 0.1 });

    // Extract sentiment from response
    const normalizedSentiment = sentiment.toLowerCase().trim();

    if (normalizedSentiment.includes('positive')) {
      return { sentiment: 'positive', score: 1 };
    } else if (normalizedSentiment.includes('negative')) {
      return { sentiment: 'negative', score: -1 };
    } else {
      return { sentiment: 'neutral', score: 0 };
    }
  },

  /**
   * Generate campaign content
   * @param {Object} campaign - Campaign details
   * @returns {Promise<string>} Generated campaign content
   */
  generateCampaignContent: async function(campaign) {
    const prompt = `
      Create a professional email campaign with the following details:

      Title: ${campaign.title}
      Subject: ${campaign.subject}
      Target audience: ${campaign.audience}
      Key points: ${campaign.keyPoints}
      Tone: ${campaign.tone || 'professional'}

      The email should include a greeting, introduction, main content with the key points, and a call to action.
      Format the response as HTML that can be directly used in an email.
    `;

    return await this.generateText(prompt, { temperature: 0.7 });
  },

  /**
   * Generate SEO recommendations
   * @param {string} content - Content to analyze
   * @param {string} keyword - Target keyword
   * @returns {Promise<Object>} SEO recommendations
   */
  generateSEORecommendations: async function(content, keyword) {
    const prompt = `
      Analyze the following content for SEO optimization for the keyword "${keyword}".
      Provide specific recommendations to improve the content's SEO.
      Format your response as a JSON object with the following structure:
      {
        "score": (a number from 0-100),
        "recommendations": [
          {
            "type": "keyword_density",
            "description": "...",
            "suggestion": "..."
          },
          ...
        ]
      }

      Content:
      ${content}
    `;

    const response = await this.generateText(prompt, { temperature: 0.3 });

    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error('Could not parse JSON from response');
    } catch (error) {
      console.error('Error parsing SEO recommendations:', error);
      return {
        score: 50,
        recommendations: [
          {
            type: 'error',
            description: 'Could not generate SEO recommendations',
            suggestion: 'Please try again later'
          }
        ]
      };
    }
  }
};

// Export AI module
window.LeewayAI = LeewayAI;
