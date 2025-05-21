/**
 * LEEWAY™ Environment Variables Loader
 * 
 * This file provides a way to load environment variables in a browser context
 * for LEEWAY™ compatible technologies.
 * 
 * It supports:
 * - Loading from .env.js file
 * - Loading from server-provided environment
 * - Secure storage of environment variables
 */

// Create namespace
window.LeewayEnv = (function() {
  // Private variables
  let _env = {};
  let _initialized = false;
  
  /**
   * Initialize the environment variables loader
   * @param {Object} options - Initialization options
   * @returns {Promise<boolean>} - Initialization success
   */
  async function init(options = {}) {
    try {
      // Check if already initialized
      if (_initialized) {
        console.warn('LeewayEnv already initialized');
        return true;
      }
      
      // Load environment variables from various sources
      await _loadEnv(options);
      
      _initialized = true;
      console.log('LeewayEnv initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing LeewayEnv:', error);
      return false;
    }
  }
  
  /**
   * Get an environment variable
   * @param {string} key - Environment variable key
   * @param {any} defaultValue - Default value if key not found
   * @param {boolean} isSensitive - Whether this is sensitive data (like API keys)
   * @returns {any} - Environment variable value
   */
  function get(key, defaultValue = null, isSensitive = false) {
    if (!_initialized) {
      console.warn('LeewayEnv not initialized. Call init() first.');
      return defaultValue;
    }
    
    if (_env[key] === undefined) {
      return defaultValue;
    }
    
    // For sensitive data, only return last 4 characters in console logs
    if (isSensitive && typeof _env[key] === 'string' && console.trace().includes('console.log')) {
      return _env[key].length > 4 ? '****' + _env[key].slice(-4) : '****';
    }
    
    return _env[key];
  }
  
  /**
   * Set an environment variable
   * @param {string} key - Environment variable key
   * @param {any} value - Environment variable value
   * @returns {boolean} - Success
   */
  function set(key, value) {
    if (!_initialized) {
      console.warn('LeewayEnv not initialized. Call init() first.');
      return false;
    }
    
    _env[key] = value;
    return true;
  }
  
  /**
   * Get all environment variables
   * @returns {Object} - All environment variables
   */
  function getAll() {
    if (!_initialized) {
      console.warn('LeewayEnv not initialized. Call init() first.');
      return {};
    }
    
    return { ..._env };
  }
  
  /**
   * Load environment variables from various sources
   * @private
   * @param {Object} options - Loading options
   * @returns {Promise<void>}
   */
  async function _loadEnv(options) {
    // Initialize empty environment
    _env = {};
    
    // Load from window.env if available (server-provided)
    if (window.env) {
      _env = { ...window.env };
    }
    
    // Load from .env.js file
    await _loadFromEnvFile();
    
    // Load from secure storage
    await _loadFromSecureStorage();
    
    // Apply any URL parameters (for development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      _loadFromUrlParams();
    }
    
    // Apply options
    if (options.env) {
      _env = { ..._env, ...options.env };
    }
    
    // Make environment available globally
    window.env = { ..._env };
  }
  
  /**
   * Load environment variables from .env.js file
   * @private
   * @returns {Promise<void>}
   */
  async function _loadFromEnvFile() {
    try {
      // Try to load .env.js file
      const response = await fetch('.env.js');
      
      if (response.ok) {
        const text = await response.text();
        
        // Extract environment variables from file
        // Format: window.env = { KEY: 'value', ... };
        const envMatch = text.match(/window\.env\s*=\s*(\{[\s\S]*\})/);
        
        if (envMatch && envMatch[1]) {
          try {
            // Parse environment variables
            const envObj = eval(`(${envMatch[1]})`);
            
            // Merge with existing environment
            _env = { ..._env, ...envObj };
            
            console.log('Loaded environment variables from .env.js');
          } catch (error) {
            console.error('Error parsing .env.js:', error);
          }
        }
      }
    } catch (error) {
      // Ignore file not found errors
      if (!error.message.includes('404')) {
        console.error('Error loading .env.js:', error);
      }
    }
  }
  
  /**
   * Load environment variables from secure storage
   * @private
   * @returns {Promise<void>}
   */
  async function _loadFromSecureStorage() {
    try {
      if (typeof idbKeyval === 'undefined') {
        return;
      }
      
      const dbPromise = idbKeyval.createStore('agent-lee-crm', 'env-store');
      const storedEnv = await idbKeyval.get('env-variables', dbPromise);
      
      if (storedEnv) {
        // Decrypt if necessary
        let parsedEnv;
        
        if (typeof storedEnv === 'string' && storedEnv.startsWith('enc:')) {
          // Encrypted environment variables
          const encryptedData = storedEnv.substring(4);
          parsedEnv = await _decrypt(encryptedData);
        } else {
          // Unencrypted environment variables
          parsedEnv = storedEnv;
        }
        
        if (parsedEnv && typeof parsedEnv === 'object') {
          // Merge with existing environment
          _env = { ..._env, ...parsedEnv };
          
          console.log('Loaded environment variables from secure storage');
        }
      }
    } catch (error) {
      console.error('Error loading environment variables from secure storage:', error);
    }
  }
  
  /**
   * Load environment variables from URL parameters
   * @private
   */
  function _loadFromUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const envParam = urlParams.get('env');
    
    if (envParam) {
      try {
        const urlEnv = JSON.parse(atob(envParam));
        
        // Merge with existing environment
        _env = { ..._env, ...urlEnv };
        
        console.log('Loaded environment variables from URL parameters');
      } catch (error) {
        console.error('Error parsing URL environment variables:', error);
      }
    }
  }
  
  /**
   * Save environment variables to secure storage
   * @param {boolean} encrypt - Whether to encrypt the environment variables
   * @returns {Promise<boolean>} - Success
   */
  async function save(encrypt = true) {
    try {
      if (typeof idbKeyval === 'undefined') {
        console.warn('idb-keyval library not loaded. Secure storage disabled.');
        return false;
      }
      
      // Extract sensitive environment variables
      const sensitiveEnv = _extractSensitiveEnv();
      
      let dataToStore;
      
      if (encrypt && window.LeewaySecureConfig) {
        // Encrypt environment variables
        const encryptedData = await _encrypt(sensitiveEnv);
        dataToStore = 'enc:' + encryptedData;
      } else {
        // Store unencrypted
        dataToStore = sensitiveEnv;
      }
      
      // Save to IndexedDB
      const dbPromise = idbKeyval.createStore('agent-lee-crm', 'env-store');
      await idbKeyval.set('env-variables', dataToStore, dbPromise);
      
      return true;
    } catch (error) {
      console.error('Error saving environment variables to secure storage:', error);
      return false;
    }
  }
  
  /**
   * Extract sensitive environment variables
   * @private
   * @returns {Object} - Sensitive environment variables
   */
  function _extractSensitiveEnv() {
    const sensitiveEnv = {};
    
    // Define sensitive environment variable prefixes
    const sensitivePrefixes = [
      'API_KEY',
      'SECRET',
      'PASSWORD',
      'TOKEN',
      'EMAILJS',
      'GOOGLE',
      'GEMINI',
      'OPENAI'
    ];
    
    // Extract sensitive environment variables
    for (const [key, value] of Object.entries(_env)) {
      if (sensitivePrefixes.some(prefix => key.includes(prefix))) {
        sensitiveEnv[key] = value;
      }
    }
    
    return sensitiveEnv;
  }
  
  /**
   * Simple encryption for environment variables
   * @private
   * @param {Object} data - Data to encrypt
   * @returns {Promise<string>} - Encrypted data
   */
  async function _encrypt(data) {
    // Use LeewaySecureConfig if available
    if (window.LeewaySecureConfig) {
      return await window.LeewaySecureConfig._encrypt(data);
    }
    
    // Fallback to simple obfuscation
    return btoa(JSON.stringify(data));
  }
  
  /**
   * Simple decryption for environment variables
   * @private
   * @param {string} encryptedData - Encrypted data
   * @returns {Promise<Object>} - Decrypted data
   */
  async function _decrypt(encryptedData) {
    // Use LeewaySecureConfig if available
    if (window.LeewaySecureConfig) {
      return await window.LeewaySecureConfig._decrypt(encryptedData);
    }
    
    // Fallback to simple deobfuscation
    try {
      return JSON.parse(atob(encryptedData));
    } catch (error) {
      console.error('Error decrypting environment variables:', error);
      return {};
    }
  }
  
  // Public API
  return {
    init,
    get,
    set,
    getAll,
    save
  };
})();

// Auto-initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    LeewayEnv.init();
  }, 300);
});
