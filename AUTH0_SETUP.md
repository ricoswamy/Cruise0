# Cruise0 Auth0 Setup Guide

This guide will help you configure Auth0 for the Cruise0 PoC application.

## 1. Auth0 Application Configuration

### Create a Single Page Application
1. Log into your Auth0 Dashboard
2. Go to Applications > Create Application
3. Name: "Cruise0 PoC"
4. Type: Single Page Application
5. Click "Create"

### Application Settings
- **Allowed Callback URLs**: `http://localhost:3000`
- **Allowed Logout URLs**: `http://localhost:3000`
- **Allowed Web Origins**: `http://localhost:3000`

### Update Environment Variables
Update `.env.local` with your Auth0 credentials:
```
REACT_APP_AUTH0_DOMAIN=your-tenant.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your-client-id
REACT_APP_AUTH0_AUDIENCE=your-api-identifier (optional)
```

## 2. Social Connection Setup (Google)

1. Go to Authentication > Social
2. Click the Google connection or create a new one
3. Enable the connection
4. Configure your Google OAuth credentials
5. Go to Applications tab and enable it for your Cruise0 PoC app

## 3. Universal Login Customization

### Custom Login Page
1. Go to Branding > Universal Login
2. Enable "Customize Login Page"
3. Use the custom HTML template provided in `auth0-universal-login.html`

### Branding Settings
1. Go to Branding > Branding
2. Upload cruise ship logo
3. Set primary color to match cruise theme (#2a5298)

## 4. Email Verification Setup

1. Go to Authentication > Database
2. Click on Username-Password-Authentication
3. Go to Settings tab
4. Enable "Requires Verification"
5. Configure email templates in Branding > Email Templates

## 5. Actions Setup

### Create Post-Login Action
1. Go to Actions > Flows
2. Click on "Login" flow
3. Create custom action using the code in `auth0-action-country.js`
4. Add the action to your Login flow

## 6. Testing

1. Start the development server: `npm start`
2. Test email/password signup and login
3. Test Google social login
4. Verify email verification requirement
5. Check that country metadata is added to user profile

## Required Auth0 Plan Features

- Custom Actions (available on paid plans)
- Social Connections (Google)
- Email verification
- Universal Login customization