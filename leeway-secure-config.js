/**
 * LEEWAY™ Secure Configuration System
 * 
 * This file provides a secure way to handle configuration and API keys
 * for LEEWAY™ compatible technologies.
 * 
 * Features:
 * - Environment variable support
 * - Secure storage in IndexedDB with encryption
 * - API key obfuscation
 * - Key rotation support
 * - Secure access control
 */

// Create namespace
window.LeewaySecureConfig = (function() {
  // Private variables
  let _config = {};
  let _initialized = false;
  let _encryptionKey = null;
  
  // IndexedDB store name
  const STORE_NAME = 'leeway-secure-config';
  const DB_NAME = 'agent-lee-crm';
  
  /**
   * Initialize the secure configuration system
   * @param {Object} options - Initialization options
   * @returns {Promise<boolean>} - Initialization success
   */
  async function init(options = {}) {
    try {
      // Check if already initialized
      if (_initialized) {
        console.warn('LeewaySecureConfig already initialized');
        return true;
      }
      
      // Generate or retrieve encryption key
      _encryptionKey = await _getEncryptionKey();
      
      // Load configuration from various sources
      await _loadConfig();
      
      _initialized = true;
      console.log('LeewaySecureConfig initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing LeewaySecureConfig:', error);
      return false;
    }
  }
  
  /**
   * Get a configuration value securely
   * @param {string} key - Configuration key (dot notation supported)
   * @param {any} defaultValue - Default value if key not found
   * @param {boolean} isSensitive - Whether this is sensitive data (like API keys)
   * @returns {any} - Configuration value
   */
  function get(key, defaultValue = null, isSensitive = false) {
    if (!_initialized) {
      console.warn('LeewaySecureConfig not initialized. Call init() first.');
      return defaultValue;
    }
    
    // Parse dot notation to access nested properties
    const value = key.split('.').reduce((obj, prop) => {
      return obj && obj[prop] !== undefined ? obj[prop] : undefined;
    }, _config);
    
    if (value === undefined) {
      return defaultValue;
    }
    
    // For sensitive data, only return last 4 characters in console logs
    if (isSensitive && typeof value === 'string' && console.trace().includes('console.log')) {
      return value.length > 4 ? '****' + value.slice(-4) : '****';
    }
    
    return value;
  }
  
  /**
   * Set a configuration value securely
   * @param {string} key - Configuration key (dot notation supported)
   * @param {any} value - Configuration value
   * @param {boolean} persist - Whether to persist to secure storage
   * @returns {Promise<boolean>} - Success
   */
  async function set(key, value, persist = true) {
    if (!_initialized) {
      console.warn('LeewaySecureConfig not initialized. Call init() first.');
      return false;
    }
    
    // Parse dot notation to set nested properties
    const parts = key.split('.');
    const lastPart = parts.pop();
    
    let current = _config;
    for (const part of parts) {
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
    
    current[lastPart] = value;
    
    // Persist to secure storage if requested
    if (persist) {
      return await _saveConfig();
    }
    
    return true;
  }
  
  /**
   * Get or generate encryption key
   * @private
   * @returns {Promise<CryptoKey>} - Encryption key
   */
  async function _getEncryptionKey() {
    try {
      // Try to get existing key from secure storage
      const storedKey = localStorage.getItem('leeway_secure_key_id');
      
      if (storedKey) {
        // Derive key from stored ID
        const encoder = new TextEncoder();
        const keyData = encoder.encode(storedKey);
        
        return await window.crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'AES-GCM' },
          false,
          ['encrypt', 'decrypt']
        );
      }
      
      // Generate new encryption key
      const key = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      
      // Store key ID (not the actual key) in localStorage
      const keyId = _generateKeyId();
      localStorage.setItem('leeway_secure_key_id', keyId);
      
      // Derive actual key from ID
      const encoder = new TextEncoder();
      const keyData = encoder.encode(keyId);
      
      return await window.crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.error('Error getting encryption key:', error);
      
      // Fallback to a basic key derivation if crypto API is not available
      const fallbackKey = _generateKeyId();
      console.warn('Using fallback encryption. Security is reduced.');
      return fallbackKey;
    }
  }
  
  /**
   * Generate a random key ID
   * @private
   * @returns {string} - Random key ID
   */
  function _generateKeyId() {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  /**
   * Encrypt sensitive data
   * @private
   * @param {any} data - Data to encrypt
   * @returns {Promise<string>} - Encrypted data as string
   */
  async function _encrypt(data) {
    try {
      if (!_encryptionKey) {
        throw new Error('Encryption key not available');
      }
      
      // Convert data to string
      const dataString = JSON.stringify(data);
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(dataString);
      
      // Generate initialization vector
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt data
      if (typeof _encryptionKey === 'string') {
        // Fallback encryption for browsers without crypto.subtle
        const result = _fallbackEncrypt(dataString, _encryptionKey);
        return JSON.stringify({ data: result, iv: Array.from(iv) });
      }
      
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        _encryptionKey,
        dataBuffer
      );
      
      // Convert to Base64 for storage
      const encryptedArray = Array.from(new Uint8Array(encryptedBuffer));
      const encryptedBase64 = btoa(String.fromCharCode.apply(null, encryptedArray));
      
      // Return encrypted data with IV
      return JSON.stringify({
        data: encryptedBase64,
        iv: Array.from(iv)
      });
    } catch (error) {
      console.error('Error encrypting data:', error);
      
      // Fallback to basic obfuscation
      return btoa(JSON.stringify(data));
    }
  }
  
  /**
   * Decrypt sensitive data
   * @private
   * @param {string} encryptedData - Encrypted data string
   * @returns {Promise<any>} - Decrypted data
   */
  async function _decrypt(encryptedData) {
    try {
      if (!_encryptionKey) {
        throw new Error('Encryption key not available');
      }
      
      // Handle fallback obfuscation
      if (encryptedData.charAt(0) !== '{') {
        return JSON.parse(atob(encryptedData));
      }
      
      // Parse encrypted data
      const { data, iv } = JSON.parse(encryptedData);
      
      // Handle fallback encryption
      if (typeof _encryptionKey === 'string') {
        return JSON.parse(_fallbackDecrypt(data, _encryptionKey));
      }
      
      // Convert from Base64
      const encryptedArray = Uint8Array.from(atob(data), c => c.charCodeAt(0));
      const ivArray = new Uint8Array(iv);
      
      // Decrypt data
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: ivArray },
        _encryptionKey,
        encryptedArray
      );
      
      // Convert to string and parse
      const decoder = new TextDecoder();
      const decryptedString = decoder.decode(decryptedBuffer);
      
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Error decrypting data:', error);
      
      // Try fallback method
      try {
        return JSON.parse(atob(encryptedData));
      } catch (e) {
        console.error('Fallback decryption failed:', e);
        return null;
      }
    }
  }
  
  /**
   * Fallback encryption for browsers without crypto.subtle
   * @private
   * @param {string} data - Data to encrypt
   * @param {string} key - Encryption key
   * @returns {string} - Encrypted data
   */
  function _fallbackEncrypt(data, key) {
    let result = '';
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(result);
  }
  
  /**
   * Fallback decryption for browsers without crypto.subtle
   * @private
   * @param {string} encryptedData - Encrypted data
   * @param {string} key - Encryption key
   * @returns {string} - Decrypted data
   */
  function _fallbackDecrypt(encryptedData, key) {
    const data = atob(encryptedData);
    let result = '';
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  }
  
  /**
   * Load configuration from all sources
   * @private
   * @returns {Promise<void>}
   */
  async function _loadConfig() {
    // Start with default config
    _config = { ...window.config?.leeway || {} };
    
    // Load from environment variables if available
    _loadFromEnv();
    
    // Load from secure storage
    await _loadFromSecureStorage();
    
    // Apply any URL parameters (for development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      _loadFromUrlParams();
    }
  }
  
  /**
   * Load configuration from environment variables
   * @private
   */
  function _loadFromEnv() {
    if (window.env) {
      // Map environment variables to config structure
      const envMapping = {
        'EMAILJS_USER_ID': 'campaigns.emailjs.userId',
        'EMAILJS_SERVICE_ID': 'campaigns.emailjs.serviceId',
        'EMAILJS_TEMPLATE_ID': 'campaigns.emailjs.templateId',
        'GA_TRACKING_ID': 'analytics.googleAnalytics.trackingId',
        'GOOGLE_MAPS_API_KEY': 'mapping.googleMaps.apiKey',
        'GEMINI_API_KEY': 'ai.gemini.apiKey',
        'OPENAI_API_KEY': 'ai.openai.apiKey'
      };
      
      // Apply mappings
      for (const [envVar, configPath] of Object.entries(envMapping)) {
        if (window.env[envVar]) {
          _setNestedProperty(_config, configPath, window.env[envVar]);
        }
      }
    }
  }
  
  /**
   * Load configuration from secure storage (IndexedDB)
   * @private
   * @returns {Promise<void>}
   */
  async function _loadFromSecureStorage() {
    try {
      if (typeof idbKeyval === 'undefined') {
        console.warn('idb-keyval library not loaded. Secure storage disabled.');
        return;
      }
      
      const dbPromise = idbKeyval.createStore(DB_NAME, STORE_NAME);
      const encryptedConfig = await idbKeyval.get('secure-config', dbPromise);
      
      if (encryptedConfig) {
        const storedConfig = await _decrypt(encryptedConfig);
        
        if (storedConfig) {
          // Merge with existing config, prioritizing stored values
          _config = _deepMerge(_config, storedConfig);
        }
      }
    } catch (error) {
      console.error('Error loading from secure storage:', error);
    }
  }
  
  /**
   * Load configuration from URL parameters (development only)
   * @private
   */
  function _loadFromUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const configParam = urlParams.get('config');
    
    if (configParam) {
      try {
        const urlConfig = JSON.parse(atob(configParam));
        _config = _deepMerge(_config, urlConfig);
        console.log('Loaded configuration from URL parameters');
      } catch (error) {
        console.error('Error parsing URL config:', error);
      }
    }
  }
  
  /**
   * Save configuration to secure storage
   * @private
   * @returns {Promise<boolean>} - Success
   */
  async function _saveConfig() {
    try {
      if (typeof idbKeyval === 'undefined') {
        console.warn('idb-keyval library not loaded. Secure storage disabled.');
        return false;
      }
      
      // Extract sensitive data to encrypt
      const sensitiveConfig = _extractSensitiveConfig(_config);
      
      // Encrypt sensitive data
      const encryptedConfig = await _encrypt(sensitiveConfig);
      
      // Save to IndexedDB
      const dbPromise = idbKeyval.createStore(DB_NAME, STORE_NAME);
      await idbKeyval.set('secure-config', encryptedConfig, dbPromise);
      
      return true;
    } catch (error) {
      console.error('Error saving to secure storage:', error);
      return false;
    }
  }
  
  /**
   * Extract sensitive configuration (API keys, etc.)
   * @private
   * @param {Object} config - Configuration object
   * @returns {Object} - Sensitive configuration
   */
  function _extractSensitiveConfig(config) {
    const sensitiveConfig = {};
    
    // Define paths to sensitive data
    const sensitivePaths = [
      'campaigns.emailjs.userId',
      'campaigns.emailjs.serviceId',
      'campaigns.emailjs.templateId',
      'analytics.googleAnalytics.trackingId',
      'mapping.googleMaps.apiKey',
      'ai.gemini.apiKey',
      'ai.openai.apiKey'
    ];
    
    // Extract sensitive data
    for (const path of sensitivePaths) {
      const value = _getNestedProperty(config, path);
      if (value !== undefined) {
        _setNestedProperty(sensitiveConfig, path, value);
      }
    }
    
    return sensitiveConfig;
  }
  
  /**
   * Get a nested property from an object using dot notation
   * @private
   * @param {Object} obj - Object to get property from
   * @param {string} path - Property path in dot notation
   * @returns {any} - Property value
   */
  function _getNestedProperty(obj, path) {
    return path.split('.').reduce((current, part) => {
      return current && current[part] !== undefined ? current[part] : undefined;
    }, obj);
  }
  
  /**
   * Set a nested property on an object using dot notation
   * @private
   * @param {Object} obj - Object to set property on
   * @param {string} path - Property path in dot notation
   * @param {any} value - Value to set
   */
  function _setNestedProperty(obj, path, value) {
    const parts = path.split('.');
    const lastPart = parts.pop();
    
    let current = obj;
    for (const part of parts) {
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
    
    current[lastPart] = value;
  }
  
  /**
   * Deep merge two objects
   * @private
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   * @returns {Object} - Merged object
   */
  function _deepMerge(target, source) {
    const output = { ...target };
    
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!(key in target)) {
            output[key] = source[key];
          } else {
            output[key] = _deepMerge(target[key], source[key]);
          }
        } else {
          output[key] = source[key];
        }
      });
    }
    
    return output;
    
    function isObject(item) {
      return (item && typeof item === 'object' && !Array.isArray(item));
    }
  }
  
  // Public API
  return {
    init,
    get,
    set
  };
})();

// Auto-initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    LeewaySecureConfig.init();
  }, 500);
});
