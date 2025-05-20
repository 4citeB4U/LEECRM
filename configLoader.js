/**
 * Configuration Loader
 * 
 * This utility helps load configuration from either config.js or environment variables,
 * providing a consistent interface for accessing configuration values.
 */

import config from './config.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Get a configuration value from either config.js or environment variables
 * 
 * @param {string} key - The configuration key to retrieve (dot notation supported for nested config)
 * @param {any} defaultValue - Default value if the key is not found
 * @returns {any} - The configuration value
 */
export function getConfig(key, defaultValue = null) {
  // Check if we should use config.js (from .env)
  const useConfigJs = process.env.USE_CONFIG_JS === 'true';
  
  if (useConfigJs) {
    // Parse dot notation to access nested properties in config object
    return key.split('.').reduce((obj, prop) => {
      return obj && obj[prop] !== undefined ? obj[prop] : defaultValue;
    }, config);
  } else {
    // Use environment variables
    return process.env[key] || defaultValue;
  }
}

/**
 * Get all configuration as a single object
 * 
 * @returns {object} - The complete configuration object
 */
export function getAllConfig() {
  const useConfigJs = process.env.USE_CONFIG_JS === 'true';
  
  if (useConfigJs) {
    return config;
  } else {
    // Convert environment variables to an object
    return { ...process.env };
  }
}

export default {
  getConfig,
  getAllConfig
};
