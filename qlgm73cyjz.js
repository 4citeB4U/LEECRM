/**
 * Example of how to use the configuration system
 * 
 * This file demonstrates how to access configuration values using the configLoader utility.
 */

import { getConfig } from './configLoader.js';

// Examples of accessing configuration values
function exampleUsage() {
  // Access simple configuration values
  const openaiApiKey = getConfig('openai.apiKey');
  console.log('OpenAI API Key:', openaiApiKey ? '****' + openaiApiKey.slice(-4) : 'Not configured');
  
  // Access nested configuration values
  const googleOauthClientId = getConfig('google.oauth.clientId');
  console.log('Google OAuth Client ID:', googleOauthClientId ? googleOauthClientId.substring(0, 10) + '...' : 'Not configured');
  
  // Use default values if configuration is missing
  const serverPort = getConfig('app.port', 3000);
  console.log('Server Port:', serverPort);
  
  // Access voice configuration
  const assistantName = getConfig('voicePersonality.assistantName');
  console.log('Assistant Name:', assistantName);
  
  // Access API keys
  const weatherApiKey = getConfig('weatherMap.apiKey');
  console.log('Weather API Key:', weatherApiKey ? '****' + weatherApiKey.slice(-4) : 'Not configured');
}

// Run the example
exampleUsage();

// Export the example function for potential reuse
export default exampleUsage;
