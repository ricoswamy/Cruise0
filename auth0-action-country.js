/**
 * Auth0 Post-Login Action: Add Country to User Metadata
 * 
 * This action adds the user's country based on their IP address
 * to their user metadata during the login flow.
 */

const axios = require('axios');

/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  // Use simple field name
  const metadataField = 'usercountry';
  const existingCountry = event.user.user_metadata?.[metadataField];
  
  if (existingCountry) {
    // Country already exists, add it to the token
    api.idToken.setCustomClaim('usercountry', existingCountry);
    api.accessToken.setCustomClaim('usercountry', existingCountry);
    return;
  }

  // Get the user's IP address
  const userIP = event.request.ip;
  
  // Skip for localhost/private IPs during development
  if (userIP === '127.0.0.1' || userIP === '::1' || userIP.startsWith('192.168.') || userIP.startsWith('10.') || userIP.startsWith('172.')) {
    const defaultCountry = 'US'; // Default for development
    
    // Store in user metadata
    api.user.setUserMetadata(metadataField, defaultCountry);
    
    // Add to tokens
    api.idToken.setCustomClaim('usercountry', defaultCountry);
    api.accessToken.setCustomClaim('usercountry', defaultCountry);
    
    console.log(`Development environment detected. Set default country: ${defaultCountry}`);
    return;
  }

  try {
    // Use ipapi.co free service to get country from IP
    const response = await axios.get(`https://ipapi.co/${userIP}/json/`, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Cruise0-Auth0-Action/1.0'
      }
    });

    const country = response.data.country_code || response.data.country || 'Unknown';
    
    // Store the country in user metadata
    api.user.setUserMetadata(metadataField, country);
    
    // Add country to ID token and access token
    api.idToken.setCustomClaim('usercountry', country);
    api.accessToken.setCustomClaim('usercountry', country);
    
    console.log(`Successfully added country ${country} for user ${event.user.user_id} from IP ${userIP}`);
    
  } catch (error) {
    console.error('Failed to get country from IP:', error.message);
    
    // Fallback: set unknown country but don't fail the login
    const fallbackCountry = 'Unknown';
    api.user.setUserMetadata(metadataField, fallbackCountry);
    api.idToken.setCustomClaim('usercountry', fallbackCountry);
    api.accessToken.setCustomClaim('usercountry', fallbackCountry);
  }
};

/**
 * Handler that will be invoked when this action is resuming after an external redirect.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onContinuePostLogin = async (event, api) => {
  // Not used in this action
};