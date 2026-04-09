export const environment = {
  production: false,
  // Empty string = same-origin requests, proxied by Angular dev-server to mock server.
  // Do NOT use 'http://localhost:3000' — cross-origin XHR fails in Cypress Electron.
  apiUrl: '',
  googleClientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
};

