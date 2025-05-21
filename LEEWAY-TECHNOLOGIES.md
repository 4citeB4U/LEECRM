# LEEWAY™ Compatible Technologies Implementation

This document provides an overview of the LEEWAY™ compatible technologies implemented in the CRM system for Campaigning, SEO & Analytics.

## Overview

The implementation follows LEEWAY™ standards:
- Single-file SPA architecture
- Offline-first with IndexedDB
- Client-side processing
- Browser-native APIs where possible

## Files Structure

The implementation consists of the following files:

1. **leeway-technologies.js** - Core technologies implementation (Voice, Campaigns, SEO)
2. **leeway-analytics.js** - Analytics implementation (Chart.js, Google Analytics)
3. **leeway-mapping.js** - Mapping implementation (Google Maps, Geolocation)
4. **leeway-ai.js** - AI integration (Google Gemini, OpenAI, WebLLM)
5. **leeway-integration.js** - Integration of all technologies
6. **leeway-config.js** - Configuration settings

## Technologies Implemented

### 1. Frontend Framework & Styling

- **Vanilla JavaScript** with modular architecture
- **Tailwind CSS** for styling (already implemented in the CRM)

### 2. State & Data Management

- **IndexedDB** with idb-keyval for client-side persistent storage
- Offline-first architecture for all data operations

### 3. Voice Dictation & AI Interaction

- **Web Speech API** for voice dictation and commands
- **Web Speech Synthesis API** for AI assistant voice responses

### 4. Campaign Sending & Multi-Channel Messaging

- **EmailJS** integration for sending emails directly from client
- Campaign templates and scheduling system

### 5. SEO Tools & Integration

- Client-side SEO analysis tools
- Content optimization suggestions
- Integration with AI for advanced SEO recommendations

### 6. Analytics & Data Visualization

- **Chart.js** for rendering campaign performance charts
- Local analytics processing in JavaScript
- Google Analytics integration (optional)

### 7. Scheduling & Drip Campaigns

- IndexedDB + scheduling system for drip campaigns
- Follow-up task creation and management

### 8. AI & Automation

- **Google Gemini API** integration for AI assistant
- **OpenAI API** as fallback option
- **WebLLM** for local AI processing (offline capabilities)

### 9. Map & Location

- **Google Maps JS API** for location tracking and visualization
- **Geolocation API** for user location

## Usage Instructions

### Configuration

All configuration settings are in `leeway-config.js`. Update this file with your API keys and preferences:

```javascript
window.config.leeway = {
  // Voice dictation configuration
  voice: { ... },

  // Email campaign configuration
  campaigns: { ... },

  // Analytics configuration
  analytics: { ... },

  // Mapping configuration
  mapping: { ... },

  // AI configuration
  ai: { ... },

  // SEO configuration
  seo: { ... }
};
```

### Voice Dictation

```javascript
// Initialize voice dictation
LeewayTech.Voice.initDictation({
  onStart: () => console.log('Dictation started'),
  onResult: (text) => console.log('Interim result:', text),
  onFinalResult: (text) => console.log('Final result:', text),
  onError: (error) => console.error('Error:', error),
  onEnd: () => console.log('Dictation ended')
});

// Start dictation
LeewayTech.Voice.startDictation();

// Stop dictation
LeewayTech.Voice.stopDictation();

// Text-to-speech
LeewayTech.Voice.speak('Hello, I am Agent Lee');
```

### Campaign Sending

```javascript
// Initialize EmailJS
LeewayTech.Campaigns.initEmailJS(userId, serviceId, templateId);

// Send a campaign
LeewayTech.Campaigns.sendCampaign({
  recipients: ['example@example.com'],
  subject: 'Campaign Subject',
  body: '<h1>Campaign Content</h1><p>Hello world</p>',
  fromName: 'Leonard Lee',
  replyTo: 'leonard@example.com'
},
response => console.log('Success:', response),
error => console.error('Error:', error));
```

### SEO Analysis

```javascript
// Analyze content for SEO
const analysis = LeewayTech.SEO.analyzeContent(
  'Your content here with target keyword mentioned several times',
  'target keyword'
);

console.log('Keyword density:', analysis.keywordDensity);
console.log('Suggestions:', analysis.suggestions);
```

### Analytics

```javascript
// Initialize analytics
LeewayAnalytics.init({
  gaTrackingId: 'G-XXXXXXXXXX'
});

// Track an event
LeewayAnalytics.trackEvent('Campaign', 'send', 'Campaign Name', 1);

// Create a chart
LeewayAnalytics.createCampaignPerformanceChart('chart-canvas-id', campaignsData);
```

### AI Integration

```javascript
// Initialize AI
LeewayAI.init({
  defaultProvider: 'gemini',
  apiKeys: {
    gemini: 'YOUR_GEMINI_API_KEY',
    openai: 'YOUR_OPENAI_API_KEY'
  }
});

// Generate text
const response = await LeewayAI.generateText('Write a follow-up email');

// Generate campaign content
const campaignContent = await LeewayAI.generateCampaignContent({
  title: 'Summer Promotion',
  subject: 'Special Summer Discounts',
  audience: 'Music store owners',
  keyPoints: 'Discounts, new products, limited time',
  tone: 'professional'
});
```

### Mapping

```javascript
// Initialize mapping
LeewayMapping.init({
  apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  mapElementId: 'map',
  useGeolocation: true
});

// Add a marker
LeewayMapping.addMarker({
  position: { lat: 43.0389, lng: -87.9065 },
  title: 'Milwaukee Music Store',
  infoContent: '<h3>Milwaukee Music Store</h3><p>123 Main St</p>'
});
```

## Integration

All technologies are integrated through the `LeewayIntegration` module, which is automatically initialized when the page loads:

```javascript
// Initialize all technologies
LeewayIntegration.init({
  emailjs: { ... },
  analytics: { ... },
  mapping: { ... },
  ai: { ... }
});
```

## Extending the Implementation

To add new features or technologies:

1. Create a new module in the appropriate file
2. Add configuration options to `leeway-config.js`
3. Update the integration in `leeway-integration.js`
4. Include any necessary CDN scripts in `index.html`

## API Keys and Security

The implementation includes a secure configuration system for handling API keys and sensitive data:

### Secure Configuration System

The secure configuration system consists of three main components:

1. **LeewaySecureConfig** - Core secure configuration manager with encryption
2. **LeewayEnv** - Environment variables manager
3. **LeewayApiKeys** - API key manager with rotation and usage tracking

### Setting Up API Keys

1. **Copy the template file**: Rename `.env.js.template` to `.env.js` and add your API keys:

```javascript
window.env = {
  EMAILJS_USER_ID: 'your_emailjs_user_id',
  EMAILJS_SERVICE_ID: 'your_emailjs_service_id',
  EMAILJS_TEMPLATE_ID: 'your_emailjs_template_id',

  GOOGLE_MAPS_API_KEY: 'your_google_maps_api_key',
  GA_TRACKING_ID: 'your_google_analytics_tracking_id',

  GEMINI_API_KEY: 'your_gemini_api_key',
  OPENAI_API_KEY: 'your_openai_api_key',

  // Security settings
  ENCRYPT_STORED_DATA: true,
  API_KEY_ROTATION_DAYS: 30
};
```

2. **Keep `.env.js` out of version control**: The file is already added to `.gitignore`.

### Using API Keys Securely

```javascript
// Get an API key securely
const apiKey = LeewayApiKeys.getKey('gemini');

// Set an API key securely
await LeewayApiKeys.setKey('openai', 'your-new-api-key');

// Rotate an API key
await LeewayApiKeys.rotateKey('google-maps', 'your-new-api-key');

// Check if a key needs rotation
if (LeewayApiKeys.needsRotation('emailjs')) {
  console.warn('EmailJS API key needs rotation');
}

// Get usage statistics
const stats = LeewayApiKeys.getUsageStats('gemini');
console.log(`Total usage: ${stats.totalUsage}`);
```

### Security Features

1. **Encryption**: Sensitive data is encrypted before storage in IndexedDB
2. **Key Rotation**: Automatic notifications when API keys should be rotated
3. **Usage Tracking**: Monitor API key usage to prevent rate limit issues
4. **Secure Access**: API keys are never exposed in logs or console output

### Additional Security Recommendations

1. Implement server-side proxies for sensitive API calls
2. Set up proper CORS and referrer policies
3. Use API key restrictions (domain, IP, etc.)
4. Consider using a backend service for handling API keys in production

## Compatibility

This implementation is compatible with modern browsers that support:
- IndexedDB
- Web Speech API
- ES6+ JavaScript
- Fetch API
- Web Components
