// Cypress support file — runs before every test file.
// Add global hooks or custom commands here.

import './commands';

const MOCK_SERVER = 'http://localhost:3000';

/**
 * Resets the mock server to its initial seed state and clears the browser's
 * localStorage so each test starts with a completely clean slate.
 */
Cypress.Commands.add('resetMockServer', () => {
  cy.clearLocalStorage();
  cy.request('POST', `${MOCK_SERVER}/test/reset`);
});

/**
 * Programmatic admin login — bypasses the UI for speed and reliability.
 * Calls the mock server directly via cy.request (no CORS constraints),
 * injects the returned tokens into localStorage *before* Angular bootstraps,
 * then navigates to /profile.
 */
Cypress.Commands.add('loginAsAdmin', (username = 'superadmin', password = 'superadmin123') => {
  cy.request('POST', `${MOCK_SERVER}/user-login`, { username, password }).then(response => {
    const { profile, accessToken } = response.body;
    cy.visit('/profile', {
      onBeforeLoad(win) {
        win.localStorage.setItem('nexa_access_token', accessToken.accessToken);
        win.localStorage.setItem('nexa_refresh_token', accessToken.refreshToken);
        win.localStorage.setItem('nexa_profile', JSON.stringify(profile));
      },
    });
  });
});
