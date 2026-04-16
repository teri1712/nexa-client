// Cypress support file — runs before every test file.
// Add global hooks or custom commands here.

import './commands';

Cypress.Commands.add('loginAsAdmin', (username = 'superadmin', password = 'superadmin123') => {
      cy.fixture('login-success').then(data => {
            const {profile, accessToken} = data;
            cy.visit('/profile', {
                  onBeforeLoad(win) {
                        win.localStorage.setItem('nexa_access_token', accessToken.accessToken);
                        win.localStorage.setItem('nexa_refresh_token', accessToken.refreshToken);
                        win.localStorage.setItem('nexa_profile', JSON.stringify(profile));
                  },
            });
      });
});