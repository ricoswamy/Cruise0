/**
 * Auth0 Post-Login Action: Require MFA for Non-Social Users
 * 
 * This action requires Multi-Factor Authentication (MFA) only for users
 * who sign up/login with email and password (non-social users).
 * Social login users (Google, etc.) are exempt from MFA requirements.
 */

/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  // Check if this is a social connection
  const connection = event.connection || {};
  const connectionStrategy = connection.strategy;
  
  // List of social connection strategies that should be exempt from MFA
  const socialStrategies = [
    'google-oauth2',
    'facebook',
    'twitter',
    'github',
    'linkedin',
    'microsoft-account',
    'apple',
    'instagram',
    'oauth2'  // Generic OAuth2
  ];
  
  // Check if user is logging in via social connection
  const isSocialLogin = socialStrategies.includes(connectionStrategy);
  
  if (isSocialLogin) {
    console.log(`User ${event.user.user_id} is using social login (${connectionStrategy}), skipping MFA requirement`);
    return;
  }
  
  // This is a non-social user (email/password), check if they have MFA enrolled
  const user = event.user;
  
  // Check if user has any MFA factors enrolled
  const hasMfaEnrolled = user.multifactor && user.multifactor.length > 0;
  
  if (!hasMfaEnrolled) {
    console.log(`User ${event.user.user_id} is non-social user without MFA, requiring enrollment`);
    
    // Challenge the user to enroll in MFA
    api.multifactor.enable('any', {
      allowRememberBrowser: false  // Force MFA every time for security
    });
    
    return;
  }
  
  // User has MFA enrolled, check if this login needs MFA challenge
  const shouldChallengeMfa = !event.authentication?.methods?.find(method => 
    method.name === 'mfa'
  );
  
  if (shouldChallengeMfa) {
    console.log(`User ${event.user.user_id} has MFA enrolled, challenging for this login`);
    
    // Challenge the user for MFA
    api.multifactor.enable('any', {
      allowRememberBrowser: true  // Allow remember browser for enrolled users
    });
    
    return;
  }
  
  console.log(`User ${event.user.user_id} has completed MFA, allowing login`);
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