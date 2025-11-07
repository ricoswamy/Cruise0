/**
 * Auth0 Pre User Registration Action: Block Disposable Emails
 * 
 * This action blocks signup attempts using disposable/temporary email addresses
 * using the Disify.com API for email validation.
 */

const axios = require('axios');

/**
 * Handler that will be called during the execution of a PreUserRegistration flow.
 *
 * @param {Event} event - Details about the user and the context in which they are registering.
 * @param {PreUserRegistrationAPI} api - Interface whose methods can be used to change the behavior of the signup.
 */
exports.onExecutePreUserRegistration = async (event, api) => {
  const email = event.user.email;
  
  if (!email) {
    console.log('No email provided, allowing registration');
    return;
  }

  console.log(`Checking email: ${email}`);

  try {
    // Use Disify.com API to check if email is disposable
    const response = await axios.get(`https://www.disify.com/api/email/${email}`, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Cruise0-Auth0-Action/1.0'
      }
    });

    const isDisposable = response.data.disposable;
    
    if (isDisposable) {
      console.log(`Blocked disposable email signup: ${email}`);
      
      // Block the registration with a custom error message
      api.access.deny(
        'signup_blocked_disposable_email',
        'Disposable email addresses are not allowed. Please use a permanent email address to create your Cruise0 account.'
      );
      return;
    }
    
    console.log(`Email ${email} is valid, allowing registration`);
    
  } catch (error) {
    console.error('Failed to validate email:', error.message);
    
    // Fallback: Check against common disposable email domains
    const disposableDomains = [
      '10minutemail.com',
      'guerrillamail.com',
      'mailinator.com',
      'tempmail.org',
      'yopmail.com',
      '7temp.org',
      'temp-mail.org',
      'throwaway.email',
      'getnada.com',
      'maildrop.cc',
      'dispostable.com',
      'sharklasers.com',
      'grr.la',
      'pokemail.net',
      'spamgourmet.com'
    ];
    
    const emailDomain = email.split('@')[1]?.toLowerCase();
    
    if (disposableDomains.includes(emailDomain)) {
      console.log(`Blocked known disposable email domain: ${emailDomain}`);
      
      api.access.deny(
        'signup_blocked_disposable_email',
        'Disposable email addresses are not allowed. Please use a permanent email address to create your Cruise0 account.'
      );
      return;
    }
    
    // If API fails and domain not in blocklist, allow registration
    console.log(`Email validation API failed, allowing registration for: ${email}`);
  }
};

/**
 * Handler that will be invoked when this action is resuming after an external redirect.
 *
 * @param {Event} event - Details about the user and the context in which they are registering.
 * @param {PreUserRegistrationAPI} api - Interface whose methods can be used to change the behavior of the signup.
 */
exports.onContinuePreUserRegistration = async (event, api) => {
  // Not used in this action
};