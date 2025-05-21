# LEEWAY™ Secure Configuration System

This document provides detailed information about the secure configuration system implemented for the LEEWAY™ CRM system.

## Overview

The secure configuration system consists of three main components:

1. **LeewaySecureConfig** - Core secure configuration manager with encryption
2. **LeewayEnv** - Environment variables manager
3. **LeewayApiKeys** - API key manager with rotation and usage tracking

## Files

- **leeway-secure-config.js** - Core secure configuration manager
- **leeway-env.js** - Environment variables loader
- **leeway-api-keys.js** - API key manager
- **.env.js.template** - Template for environment variables

## Setup Instructions

### 1. Set Up Environment Variables

1. Copy the `.env.js.template` file to `.env.js`:

```bash
cp .env.js.template .env.js
```

2. Edit the `.env.js` file to add your API keys:

```javascript
window.env = {
  // API Keys
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

3. Make sure `.env.js` is in your `.gitignore` file to prevent it from being committed to version control.

### 2. Include the Secure Configuration Files

Make sure the following script tags are included in your HTML file in the correct order:

```html
<!-- LEEWAY™ Secure Configuration -->
<script src="leeway-secure-config.js"></script>
<script src="leeway-env.js"></script>
<script src="leeway-api-keys.js"></script>
```

## Usage

### LeewaySecureConfig

The `LeewaySecureConfig` module provides secure storage and access to configuration values.

```javascript
// Initialize
await LeewaySecureConfig.init();

// Get a configuration value
const value = LeewaySecureConfig.get('campaigns.emailjs.userId');

// Get a sensitive value (will be masked in console logs)
const apiKey = LeewaySecureConfig.get('ai.gemini.apiKey', null, true);

// Set a configuration value
await LeewaySecureConfig.set('analytics.googleAnalytics.trackingId', 'G-XXXXXXXXXX');
```

### LeewayEnv

The `LeewayEnv` module provides access to environment variables.

```javascript
// Initialize
await LeewayEnv.init();

// Get an environment variable
const apiKey = LeewayEnv.get('GEMINI_API_KEY');

// Get a sensitive environment variable (will be masked in console logs)
const apiKey = LeewayEnv.get('OPENAI_API_KEY', null, true);

// Set an environment variable
LeewayEnv.set('CUSTOM_VARIABLE', 'value');

// Get all environment variables
const allEnv = LeewayEnv.getAll();

// Save environment variables to secure storage
await LeewayEnv.save(true); // true = encrypt
```

### LeewayApiKeys

The `LeewayApiKeys` module provides secure management of API keys.

```javascript
// Initialize
await LeewayApiKeys.init();

// Get an API key
const apiKey = LeewayApiKeys.getKey('gemini');

// Set an API key
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

## Security Features

### Encryption

Sensitive data is encrypted before being stored in IndexedDB. The encryption uses:

- AES-GCM encryption when the Web Crypto API is available
- Fallback to a simpler encryption method when Web Crypto is not available

### Key Rotation

API keys are automatically checked for rotation based on the `API_KEY_ROTATION_DAYS` setting. When a key needs rotation:

1. A notification is displayed to the user
2. The old key is backed up before being replaced
3. Usage statistics are preserved

### Usage Tracking

API key usage is tracked to:

- Monitor usage patterns
- Prevent rate limit issues
- Provide insights into API usage

### Secure Access

API keys are never exposed in logs or console output:

- Sensitive values are masked in console logs
- API keys are only accessible through the secure API

## Best Practices

### API Key Security

1. **Use environment variables**: Store API keys in `.env.js` instead of hardcoding them
2. **Rotate keys regularly**: Set up a schedule for key rotation (e.g., every 30 days)
3. **Monitor usage**: Check usage statistics to detect unusual patterns
4. **Use key restrictions**: Set up API key restrictions (domain, IP, etc.) when possible

### Configuration Management

1. **Use the secure API**: Always use the secure API to access configuration values
2. **Encrypt sensitive data**: Enable encryption for sensitive data
3. **Separate concerns**: Use different keys for different services
4. **Document configuration**: Keep track of configuration options and their purpose

## Troubleshooting

### API Keys Not Loading

1. Check if `.env.js` exists and contains the correct API keys
2. Verify that the secure configuration files are loaded in the correct order
3. Check the browser console for any errors

### Encryption Issues

1. Check if the Web Crypto API is available in your browser
2. Clear IndexedDB storage if you encounter persistent encryption issues
3. Verify that the encryption key is being generated correctly

### Key Rotation Notifications

1. If you're not seeing key rotation notifications, check if the keys are older than the rotation period
2. Verify that the notification container is being created correctly
3. Check if the browser is blocking notifications

## Advanced Configuration

### Custom Encryption

You can customize the encryption method by modifying the `_encrypt` and `_decrypt` functions in `leeway-secure-config.js`.

### Custom Storage

By default, the secure configuration system uses IndexedDB for storage. You can modify the storage mechanism by updating the storage-related functions.

### Additional Security Measures

For additional security, consider:

1. Implementing a server-side proxy for API calls
2. Using a backend service for API key management
3. Implementing rate limiting and monitoring
4. Setting up alerts for unusual API usage patterns
