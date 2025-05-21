/**
 * LEEWAY™ Compatible Technologies Implementation
 * 
 * This file implements technologies compatible with LEEWAY™ standards for:
 * - Campaigning
 * - SEO
 * - Analytics
 * 
 * LEEWAY™ standards favor:
 * - Single-file SPAs
 * - Offline-first architecture with IndexedDB
 * - Client-side processing
 * - Browser-native APIs
 */

// ======================================================
// 1. Web Speech API Implementation (Voice Dictation)
// ======================================================

const LeewayVoice = {
  recognition: null,
  synthesis: null,
  isListening: false,
  transcript: '',
  
  /**
   * Initialize Web Speech API for voice dictation
   * @param {Object} options - Configuration options
   * @param {Function} options.onResult - Callback for interim results
   * @param {Function} options.onFinalResult - Callback for final results
   * @param {Function} options.onError - Callback for errors
   */
  initDictation: function(options = {}) {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Web Speech API is not supported in this browser');
      if (options.onError) options.onError('Speech recognition not supported');
      return false;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Configure recognition
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = options.lang || 'en-US';
    
    // Set up event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('Voice dictation started');
      if (options.onStart) options.onStart();
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
      
      this.transcript = finalTranscript || interimTranscript;
      
      if (interimTranscript && options.onResult) {
        options.onResult(interimTranscript);
      }
      
      if (finalTranscript && options.onFinalResult) {
        options.onFinalResult(finalTranscript);
      }
    };
    
    this.recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      if (options.onError) options.onError(event.error);
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Voice dictation ended');
      if (options.onEnd) options.onEnd();
    };
    
    return true;
  },
  
  /**
   * Start voice dictation
   */
  startDictation: function() {
    if (this.recognition) {
      this.recognition.start();
    }
  },
  
  /**
   * Stop voice dictation
   */
  stopDictation: function() {
    if (this.recognition) {
      this.recognition.stop();
    }
  },
  
  /**
   * Initialize speech synthesis for AI responses
   */
  initSpeechSynthesis: function() {
    if (!('speechSynthesis' in window)) {
      console.error('Speech Synthesis API is not supported in this browser');
      return false;
    }
    
    this.synthesis = window.speechSynthesis;
    return true;
  },
  
  /**
   * Speak text using speech synthesis
   * @param {string} text - Text to speak
   * @param {Object} options - Speech options
   */
  speak: function(text, options = {}) {
    if (!this.synthesis) {
      this.initSpeechSynthesis();
    }
    
    if (this.synthesis) {
      // Cancel any ongoing speech
      this.synthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure utterance
      utterance.lang = options.lang || 'en-US';
      utterance.pitch = options.pitch || 1;
      utterance.rate = options.rate || 1;
      utterance.volume = options.volume || 1;
      
      // Set voice if specified
      if (options.voiceName) {
        const voices = this.synthesis.getVoices();
        const voice = voices.find(v => v.name === options.voiceName);
        if (voice) utterance.voice = voice;
      }
      
      // Event handlers
      if (options.onStart) utterance.onstart = options.onStart;
      if (options.onEnd) utterance.onend = options.onEnd;
      if (options.onError) utterance.onerror = options.onError;
      
      this.synthesis.speak(utterance);
    }
  }
};

// ======================================================
// 2. EmailJS Integration for Campaign Sending
// ======================================================

const LeewayCampaigns = {
  /**
   * Initialize EmailJS for sending campaigns
   * @param {string} userId - EmailJS user ID
   * @param {string} serviceId - EmailJS service ID
   * @param {string} templateId - EmailJS template ID
   */
  initEmailJS: function(userId, serviceId, templateId) {
    if (typeof emailjs === 'undefined') {
      console.error('EmailJS library not loaded. Please include the EmailJS script in your HTML.');
      return false;
    }
    
    this.emailjs = {
      userId,
      serviceId,
      templateId
    };
    
    emailjs.init(userId);
    return true;
  },
  
  /**
   * Send a campaign using EmailJS
   * @param {Object} campaign - Campaign data
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   */
  sendCampaign: async function(campaign, onSuccess, onError) {
    if (!this.emailjs) {
      if (onError) onError('EmailJS not initialized');
      return;
    }
    
    try {
      const templateParams = {
        to_email: campaign.recipients.join(','),
        subject: campaign.subject,
        message_html: campaign.body,
        from_name: campaign.fromName || 'Leonard Lee',
        reply_to: campaign.replyTo || 'leonard@leemusicdistribution.com'
      };
      
      const response = await emailjs.send(
        this.emailjs.serviceId,
        this.emailjs.templateId,
        templateParams
      );
      
      if (onSuccess) onSuccess(response);
      return response;
    } catch (error) {
      console.error('Error sending campaign:', error);
      if (onError) onError(error);
      throw error;
    }
  }
};

// ======================================================
// 3. SEO Tools Integration
// ======================================================

const LeewaySEO = {
  /**
   * Analyze content for SEO optimization
   * @param {string} content - Content to analyze
   * @param {string} keyword - Target keyword
   * @returns {Object} SEO analysis results
   */
  analyzeContent: function(content, keyword) {
    if (!content || !keyword) return null;
    
    const contentLower = content.toLowerCase();
    const keywordLower = keyword.toLowerCase();
    
    // Basic SEO analysis
    const keywordCount = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length;
    const contentLength = content.length;
    const keywordDensity = (keywordCount / (contentLength / 100)).toFixed(2);
    
    // Check if keyword is in the first paragraph
    const firstParagraph = content.split('\n')[0];
    const keywordInFirstParagraph = firstParagraph.toLowerCase().includes(keywordLower);
    
    // Check readability (very basic Flesch-Kincaid approximation)
    const sentences = content.split(/[.!?]+/).length;
    const words = content.split(/\s+/).length;
    const avgWordsPerSentence = words / sentences;
    
    return {
      keywordCount,
      keywordDensity,
      contentLength,
      keywordInFirstParagraph,
      readabilityScore: 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * (contentLength / words)),
      suggestions: this._generateSuggestions(keywordCount, keywordDensity, contentLength, keywordInFirstParagraph)
    };
  },
  
  /**
   * Generate SEO improvement suggestions
   * @private
   */
  _generateSuggestions: function(keywordCount, keywordDensity, contentLength, keywordInFirstParagraph) {
    const suggestions = [];
    
    if (keywordCount === 0) {
      suggestions.push('Add your target keyword to the content');
    } else if (keywordDensity < 0.5) {
      suggestions.push('Consider increasing keyword usage (current density: ' + keywordDensity + '%)');
    } else if (keywordDensity > 3) {
      suggestions.push('Keyword density may be too high (current: ' + keywordDensity + '%). This might appear as keyword stuffing');
    }
    
    if (contentLength < 300) {
      suggestions.push('Content is too short. Consider adding more relevant information');
    }
    
    if (!keywordInFirstParagraph) {
      suggestions.push('Add your target keyword to the first paragraph');
    }
    
    return suggestions;
  }
};

// Export all modules
window.LeewayTech = {
  Voice: LeewayVoice,
  Campaigns: LeewayCampaigns,
  SEO: LeewaySEO
};
