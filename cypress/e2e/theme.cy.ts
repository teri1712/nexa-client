describe('Theme and Dark Mode', () => {
  it('should load with light theme by default', () => {
    cy.wrap(
      Cypress.automation('remote:debugger:protocol', {
        command: 'Emulation.setEmulatedMedia',
        params: {
          media: 'page',
          features: [{ name: 'prefers-color-scheme', value: 'light' }],
        },
      })
    );
    cy.visit('/');
    cy.get('body').invoke('css', 'background-color').as('lightBg');
  });

  it('should switch to dark theme when system preference is dark', () => {
    // Baseline light mode
    cy.wrap(
      Cypress.automation('remote:debugger:protocol', {
        command: 'Emulation.setEmulatedMedia',
        params: { media: 'page', features: [{ name: 'prefers-color-scheme', value: 'light' }] },
      })
    );
    cy.visit('/');
    cy.get('body').invoke('css', 'background-color').then(lightBg => {
      // Switch to dark mode
      cy.wrap(
        Cypress.automation('remote:debugger:protocol', {
          command: 'Emulation.setEmulatedMedia',
          params: { media: 'page', features: [{ name: 'prefers-color-scheme', value: 'dark' }] },
        })
      );
      // Reload to ensure media queries are evaluated natively by the browser
      cy.reload();
      
      cy.get('body').should('not.have.css', 'background-color', lightBg);
    });
  });

  it('should allow manual theme toggling via the navbar button', () => {
    cy.clearLocalStorage();
    cy.loginAsAdmin();
    
    cy.wrap(
      Cypress.automation('remote:debugger:protocol', {
        command: 'Emulation.setEmulatedMedia',
        params: { media: 'page', features: [{ name: 'prefers-color-scheme', value: 'light' }] },
      })
    );
    
    cy.visit('/home/docs/dashboard');
    cy.get('body').invoke('css', 'background-color').then(lightBg => {
      // Toggle to explicit LIGHT
      cy.get('button[aria-label="Toggle theme"]').click();
      cy.get('html').should('have.class', 'light-theme');
      cy.get('button[aria-label="Toggle theme"] mat-icon').should('contain.text', 'light_mode');

      // Toggle to explicit DARK
      cy.get('button[aria-label="Toggle theme"]').click();
      cy.get('html').should('have.class', 'dark-theme');
      cy.get('body').should('not.have.css', 'background-color', lightBg);
      cy.get('button[aria-label="Toggle theme"] mat-icon').should('contain.text', 'dark_mode');

      // Toggle to SYSTEM
      cy.get('button[aria-label="Toggle theme"]').click();
      cy.get('html').should('not.have.class', 'dark-theme').and('not.have.class', 'light-theme');
      cy.get('button[aria-label="Toggle theme"] mat-icon').should('contain.text', 'brightness_auto');
    });
  });
});
