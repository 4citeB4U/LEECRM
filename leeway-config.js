/**
 * LEEWAY™ Technologies Configuration
 * 
 * This file contains configuration settings for LEEWAY™ compatible technologies.
 * Update this file with your API keys and other configuration settings.
 */

// Create configuration object if it doesn't exist
window.config = window.config || {};

// LEEWAY™ configuration
window.config.leeway = {
  // Voice dictation configuration
  voice: {
    // Assistant voice settings
    assistant: {
      name: 'Agent Lee',
      voiceName: 'Google US English Female', // Browser-specific voice name
      pitch: 1.0,
      rate: 1.0,
      volume: 1.0
    },
    // Recognition settings
    recognition: {
      language: 'en-US',
      continuous: true,
      interimResults: true
    }
  },
  
  // Email campaign configuration
  campaigns: {
    // EmailJS configuration
    emailjs: {
      userId: 'user_your_emailjs_user_id', // Replace with your EmailJS user ID
      serviceId: 'your_emailjs_service_id', // Replace with your EmailJS service ID
      templateId: 'your_emailjs_template_id' // Replace with your EmailJS template ID
    },
    // Default campaign templates
    templates: {
      promotional: {
        subject: 'Special Offer from Lee Music Distribution',
        body: '<h2>Special Offer for Music Stores</h2><p>Dear valued partner,</p><p>We\'re excited to offer special discounts on our entire catalog. Take advantage of these limited-time offers to stock up for the busy season ahead.</p><p>Contact us today to place your order!</p><p>Best regards,<br>Leonard Lee<br>Lee Music Distribution</p>'
      },
      newsletter: {
        subject: 'Lee Music Distribution Newsletter',
        body: '<h2>Monthly Newsletter</h2><p>Dear valued partner,</p><p>Here\'s what\'s new at Lee Music Distribution this month:</p><ul><li>New product arrivals</li><li>Upcoming events</li><li>Industry news</li></ul><p>Best regards,<br>Leonard Lee<br>Lee Music Distribution</p>'
      },
      followUp: {
        subject: 'Following Up on Our Recent Conversation',
        body: '<h2>Following Up</h2><p>Dear [Contact Name],</p><p>I wanted to follow up on our recent conversation about [Topic]. I\'d be happy to provide more information or answer any questions you might have.</p><p>Best regards,<br>Leonard Lee<br>Lee Music Distribution</p>'
      }
    }
  },
  
  // Analytics configuration
  analytics: {
    // Google Analytics configuration
    googleAnalytics: {
      trackingId: 'G-XXXXXXXXXX', // Replace with your Google Analytics tracking ID
      enableAutoPageViews: true
    },
    // Chart.js configuration
    charts: {
      colors: {
        primary: 'rgba(99, 102, 241, 0.7)',
        secondary: 'rgba(20, 184, 166, 0.7)',
        tertiary: 'rgba(245, 158, 11, 0.7)',
        quaternary: 'rgba(239, 68, 68, 0.7)'
      },
      fontFamily: '"Poppins", sans-serif'
    }
  },
  
  // Mapping configuration
  mapping: {
    // Google Maps configuration
    googleMaps: {
      apiKey: 'AIzaSyAgMwqNZinl-6rezvp62jj8eFZrJ0n3SBQ', // Replace with your Google Maps API key
      defaultLocation: { lat: 43.0389, lng: -87.9065 }, // Milwaukee
      defaultZoom: 12,
      theme: 'default' // 'default', 'dark', or 'light'
    },
    // Geolocation configuration
    geolocation: {
      enableHighAccuracy: true,
      maximumAge: 30000, // 30 seconds
      timeout: 27000 // 27 seconds
    }
  },
  
  // AI configuration
  ai: {
    // Default AI provider
    defaultProvider: 'gemini', // 'gemini', 'openai', or 'local'
    
    // Google Gemini configuration
    gemini: {
      apiKey: '', // Replace with your Google Gemini API key
      model: 'gemini-pro',
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024
    },
    
    // OpenAI configuration
    openai: {
      apiKey: '', // Replace with your OpenAI API key
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1024,
      topP: 0.95
    },
    
    // Local model configuration (WebLLM)
    local: {
      model: 'Phi-2',
      temperature: 0.7,
      maxTokens: 1024
    }
  },
  
  // SEO configuration
  seo: {
    // Keyword density thresholds
    keywordDensity: {
      min: 0.5, // Minimum keyword density (%)
      max: 3.0  // Maximum keyword density (%)
    },
    // Content length thresholds
    contentLength: {
      min: 300, // Minimum content length (characters)
      optimal: 1500 // Optimal content length (characters)
    },
    // Readability score thresholds
    readability: {
      min: 60, // Minimum readability score
      optimal: 80 // Optimal readability score
    }
  }
};

// Export configuration for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.config;
}
