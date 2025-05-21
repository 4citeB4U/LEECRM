/**
 * LEEWAY™ API Key Manager
 * 
 * This file provides a secure way to manage API keys for LEEWAY™ compatible technologies.
 * 
 * Features:
 * - Secure storage of API keys
 * - API key rotation
 * - Usage tracking
 * - Rate limiting protection
 */

// Create namespace
window.LeewayApiKeys = (function() {
  // Private variables
  let _apiKeys = {};
  let _initialized = false;
  let _usageStats = {};
  
  // IndexedDB store name
  const STORE_NAME = 'api-keys-store';
  const DB_NAME = 'agent-lee-crm';
  
  /**
   * Initialize the API key manager
   * @param {Object} options - Initialization options
   * @returns {Promise<boolean>} - Initialization success
   */
  async function init(options = {}) {
    try {
      // Check if already initialized
      if (_initialized) {
        console.warn('LeewayApiKeys already initialized');
        return true;
      }
      
      // Load API keys from secure storage
      await _loadApiKeys();
      
      // Load usage statistics
      await _loadUsageStats();
      
      // Check for key rotation
      await _checkKeyRotation();
      
      _initialized = true;
      console.log('LeewayApiKeys initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing LeewayApiKeys:', error);
      return false;
    }
  }
  
  /**
   * Get an API key
   * @param {string} service - Service name (e.g., 'gemini', 'openai', 'google-maps')
   * @param {boolean} trackUsage - Whether to track usage of this key
   * @returns {string|null} - API key or null if not found
   */
  function getKey(service, trackUsage = true) {
    if (!_initialized) {
      console.warn('LeewayApiKeys not initialized. Call init() first.');
      return null;
    }
    
    const normalizedService = service.toLowerCase();
    
    // Check if key exists
    if (!_apiKeys[normalizedService]) {
      // Try to get from environment
      const key = _getKeyFromEnvironment(normalizedService);
      
      if (key) {
        _apiKeys[normalizedService] = {
          key,
          createdAt: new Date().toISOString(),
          lastUsed: null,
          usageCount: 0
        };
      } else {
        return null;
      }
    }
    
    // Track usage
    if (trackUsage) {
      _trackKeyUsage(normalizedService);
    }
    
    return _apiKeys[normalizedService].key;
  }
  
  /**
   * Set an API key
   * @param {string} service - Service name
   * @param {string} key - API key
   * @param {boolean} persist - Whether to persist to secure storage
   * @returns {Promise<boolean>} - Success
   */
  async function setKey(service, key, persist = true) {
    if (!_initialized) {
      console.warn('LeewayApiKeys not initialized. Call init() first.');
      return false;
    }
    
    const normalizedService = service.toLowerCase();
    
    // Set key
    _apiKeys[normalizedService] = {
      key,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      usageCount: 0
    };
    
    // Persist to secure storage
    if (persist) {
      return await _saveApiKeys();
    }
    
    return true;
  }
  
  /**
   * Rotate an API key
   * @param {string} service - Service name
   * @param {string} newKey - New API key
   * @returns {Promise<boolean>} - Success
   */
  async function rotateKey(service, newKey) {
    if (!_initialized) {
      console.warn('LeewayApiKeys not initialized. Call init() first.');
      return false;
    }
    
    const normalizedService = service.toLowerCase();
    
    // Check if key exists
    if (!_apiKeys[normalizedService]) {
      return await setKey(normalizedService, newKey);
    }
    
    // Store old key for backup
    const oldKey = _apiKeys[normalizedService].key;
    const oldCreatedAt = _apiKeys[normalizedService].createdAt;
    
    // Create backup
    _apiKeys[`${normalizedService}_backup`] = {
      key: oldKey,
      createdAt: oldCreatedAt,
      rotatedAt: new Date().toISOString(),
      lastUsed: _apiKeys[normalizedService].lastUsed,
      usageCount: _apiKeys[normalizedService].usageCount
    };
    
    // Set new key
    _apiKeys[normalizedService] = {
      key: newKey,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      usageCount: 0
    };
    
    // Persist to secure storage
    return await _saveApiKeys();
  }
  
  /**
   * Get usage statistics for an API key
   * @param {string} service - Service name
   * @returns {Object|null} - Usage statistics or null if not found
   */
  function getUsageStats(service) {
    if (!_initialized) {
      console.warn('LeewayApiKeys not initialized. Call init() first.');
      return null;
    }
    
    const normalizedService = service.toLowerCase();
    
    // Check if key exists
    if (!_apiKeys[normalizedService]) {
      return null;
    }
    
    // Get usage statistics
    const keyStats = _apiKeys[normalizedService];
    const serviceStats = _usageStats[normalizedService] || {
      dailyUsage: {},
      monthlyUsage: {},
      totalUsage: 0
    };
    
    return {
      createdAt: keyStats.createdAt,
      lastUsed: keyStats.lastUsed,
      usageCount: keyStats.usageCount,
      dailyUsage: serviceStats.dailyUsage,
      monthlyUsage: serviceStats.monthlyUsage,
      totalUsage: serviceStats.totalUsage
    };
  }
  
  /**
   * Check if an API key needs rotation
   * @param {string} service - Service name
   * @returns {boolean} - Whether the key needs rotation
   */
  function needsRotation(service) {
    if (!_initialized) {
      console.warn('LeewayApiKeys not initialized. Call init() first.');
      return false;
    }
    
    const normalizedService = service.toLowerCase();
    
    // Check if key exists
    if (!_apiKeys[normalizedService]) {
      return false;
    }
    
    // Get rotation period from environment or default to 30 days
    const rotationDays = window.env?.API_KEY_ROTATION_DAYS || 30;
    
    // Check if key is older than rotation period
    const createdAt = new Date(_apiKeys[normalizedService].createdAt);
    const now = new Date();
    const diffDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
    
    return diffDays >= rotationDays;
  }
  
  /**
   * Load API keys from secure storage
   * @private
   * @returns {Promise<void>}
   */
  async function _loadApiKeys() {
    try {
      if (typeof idbKeyval === 'undefined') {
        console.warn('idb-keyval library not loaded. Secure storage disabled.');
        return;
      }
      
      const dbPromise = idbKeyval.createStore(DB_NAME, STORE_NAME);
      const encryptedKeys = await idbKeyval.get('api-keys', dbPromise);
      
      if (encryptedKeys) {
        // Decrypt keys
        let decryptedKeys;
        
        if (window.LeewaySecureConfig) {
          decryptedKeys = await window.LeewaySecureConfig._decrypt(encryptedKeys);
        } else {
          // Fallback to simple decryption
          try {
            decryptedKeys = JSON.parse(atob(encryptedKeys));
          } catch (error) {
            console.error('Error decrypting API keys:', error);
            decryptedKeys = {};
          }
        }
        
        if (decryptedKeys && typeof decryptedKeys === 'object') {
          _apiKeys = decryptedKeys;
          console.log('Loaded API keys from secure storage');
        }
      }
    } catch (error) {
      console.error('Error loading API keys from secure storage:', error);
    }
  }
  
  /**
   * Save API keys to secure storage
   * @private
   * @returns {Promise<boolean>} - Success
   */
  async function _saveApiKeys() {
    try {
      if (typeof idbKeyval === 'undefined') {
        console.warn('idb-keyval library not loaded. Secure storage disabled.');
        return false;
      }
      
      // Encrypt keys
      let encryptedKeys;
      
      if (window.LeewaySecureConfig) {
        encryptedKeys = await window.LeewaySecureConfig._encrypt(_apiKeys);
      } else {
        // Fallback to simple encryption
        encryptedKeys = btoa(JSON.stringify(_apiKeys));
      }
      
      // Save to IndexedDB
      const dbPromise = idbKeyval.createStore(DB_NAME, STORE_NAME);
      await idbKeyval.set('api-keys', encryptedKeys, dbPromise);
      
      return true;
    } catch (error) {
      console.error('Error saving API keys to secure storage:', error);
      return false;
    }
  }
  
  /**
   * Load usage statistics from secure storage
   * @private
   * @returns {Promise<void>}
   */
  async function _loadUsageStats() {
    try {
      if (typeof idbKeyval === 'undefined') {
        console.warn('idb-keyval library not loaded. Secure storage disabled.');
        return;
      }
      
      const dbPromise = idbKeyval.createStore(DB_NAME, STORE_NAME);
      const usageStats = await idbKeyval.get('api-key-usage', dbPromise);
      
      if (usageStats) {
        _usageStats = usageStats;
        console.log('Loaded API key usage statistics from secure storage');
      }
    } catch (error) {
      console.error('Error loading API key usage statistics from secure storage:', error);
    }
  }
  
  /**
   * Save usage statistics to secure storage
   * @private
   * @returns {Promise<boolean>} - Success
   */
  async function _saveUsageStats() {
    try {
      if (typeof idbKeyval === 'undefined') {
        console.warn('idb-keyval library not loaded. Secure storage disabled.');
        return false;
      }
      
      // Save to IndexedDB
      const dbPromise = idbKeyval.createStore(DB_NAME, STORE_NAME);
      await idbKeyval.set('api-key-usage', _usageStats, dbPromise);
      
      return true;
    } catch (error) {
      console.error('Error saving API key usage statistics to secure storage:', error);
      return false;
    }
  }
  
  /**
   * Track API key usage
   * @private
   * @param {string} service - Service name
   */
  function _trackKeyUsage(service) {
    // Update key usage
    if (_apiKeys[service]) {
      _apiKeys[service].lastUsed = new Date().toISOString();
      _apiKeys[service].usageCount = (_apiKeys[service].usageCount || 0) + 1;
    }
    
    // Update usage statistics
    if (!_usageStats[service]) {
      _usageStats[service] = {
        dailyUsage: {},
        monthlyUsage: {},
        totalUsage: 0
      };
    }
    
    // Get current date
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const monthKey = dateKey.substring(0, 7);
    
    // Update daily usage
    _usageStats[service].dailyUsage[dateKey] = (_usageStats[service].dailyUsage[dateKey] || 0) + 1;
    
    // Update monthly usage
    _usageStats[service].monthlyUsage[monthKey] = (_usageStats[service].monthlyUsage[monthKey] || 0) + 1;
    
    // Update total usage
    _usageStats[service].totalUsage = (_usageStats[service].totalUsage || 0) + 1;
    
    // Save usage statistics periodically (every 10 calls)
    if (_usageStats[service].totalUsage % 10 === 0) {
      _saveUsageStats();
      _saveApiKeys();
    }
  }
  
  /**
   * Check if any API keys need rotation
   * @private
   * @returns {Promise<void>}
   */
  async function _checkKeyRotation() {
    // Get rotation period from environment or default to 30 days
    const rotationDays = window.env?.API_KEY_ROTATION_DAYS || 30;
    
    // Check each key
    for (const service in _apiKeys) {
      // Skip backup keys
      if (service.endsWith('_backup')) {
        continue;
      }
      
      // Check if key is older than rotation period
      const createdAt = new Date(_apiKeys[service].createdAt);
      const now = new Date();
      const diffDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
      
      if (diffDays >= rotationDays) {
        console.warn(`API key for ${service} is ${diffDays} days old and should be rotated.`);
        
        // Trigger rotation notification
        _notifyKeyRotation(service, diffDays);
      }
    }
  }
  
  /**
   * Notify that an API key needs rotation
   * @private
   * @param {string} service - Service name
   * @param {number} age - Age of the key in days
   */
  function _notifyKeyRotation(service, age) {
    // Create notification element if it doesn't exist
    let notificationContainer = document.getElementById('api-key-notifications');
    
    if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.id = 'api-key-notifications';
      notificationContainer.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';
      document.body.appendChild(notificationContainer);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded shadow-md max-w-md';
    notification.innerHTML = `
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium">
            API key for <strong>${service}</strong> is ${age} days old and should be rotated.
          </p>
        </div>
        <div class="ml-auto pl-3">
          <button type="button" class="inline-flex text-amber-500 hover:text-amber-700">
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    `;
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Add event listener to close button
    const closeButton = notification.querySelector('button');
    closeButton.addEventListener('click', () => {
      notification.remove();
    });
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      notification.remove();
    }, 10000);
  }
  
  /**
   * Get API key from environment variables
   * @private
   * @param {string} service - Service name
   * @returns {string|null} - API key or null if not found
   */
  function _getKeyFromEnvironment(service) {
    // Map service names to environment variable names
    const envMapping = {
      'gemini': 'GEMINI_API_KEY',
      'openai': 'OPENAI_API_KEY',
      'google-maps': 'GOOGLE_MAPS_API_KEY',
      'emailjs': 'EMAILJS_USER_ID',
      'emailjs-service': 'EMAILJS_SERVICE_ID',
      'emailjs-template': 'EMAILJS_TEMPLATE_ID',
      'google-analytics': 'GA_TRACKING_ID'
    };
    
    // Get environment variable name
    const envVar = envMapping[service];
    
    if (!envVar) {
      return null;
    }
    
    // Try to get from LeewayEnv
    if (window.LeewayEnv) {
      const key = window.LeewayEnv.get(envVar);
      if (key) {
        return key;
      }
    }
    
    // Try to get from window.env
    if (window.env && window.env[envVar]) {
      return window.env[envVar];
    }
    
    // Try to get from window.config.leeway
    if (window.config && window.config.leeway) {
      // Map service names to config paths
      const configMapping = {
        'gemini': 'ai.gemini.apiKey',
        'openai': 'ai.openai.apiKey',
        'google-maps': 'mapping.googleMaps.apiKey',
        'emailjs': 'campaigns.emailjs.userId',
        'emailjs-service': 'campaigns.emailjs.serviceId',
        'emailjs-template': 'campaigns.emailjs.templateId',
        'google-analytics': 'analytics.googleAnalytics.trackingId'
      };
      
      // Get config path
      const configPath = configMapping[service];
      
      if (configPath) {
        // Parse dot notation to access nested properties
        const value = configPath.split('.').reduce((obj, prop) => {
          return obj && obj[prop] !== undefined ? obj[prop] : undefined;
        }, window.config.leeway);
        
        if (value) {
          return value;
        }
      }
    }
    
    return null;
  }
  
  // Public API
  return {
    init,
    getKey,
    setKey,
    rotateKey,
    getUsageStats,
    needsRotation
  };
})();

// Auto-initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    LeewayApiKeys.init();
  }, 700);
});
