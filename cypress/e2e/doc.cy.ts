describe('Doc management', () => {
      beforeEach(() => {
            cy.clearLocalStorage();
            cy.loginAsAdmin();

            cy.fixture('doc-search-success').then(data => {
                  cy.intercept('GET', '**/docs*', {statusCode: 200, body: data, delay: 1000})
            })
            cy.fixture('doc-suggest-success').then(data => {
                  cy.intercept('POST', '**/docs/suggest', {statusCode: 200, body: data, delay: 1000})
            })

      })
      it('should display list of doc after clicking search', () => {

            cy.visit('/docs/dashboard');
            cy.get('#search-input').type('test');
            cy.contains('button', 'Search').click();
            cy.get('#search-spinner').should('be.visible');
            cy.get('#results-list').should('be.visible');
            cy.contains('financial_report_q1_2025').should('be.visible');
      });

      it('should display suggestion after clicking search', () => {

            cy.visit('/docs/dashboard');
            cy.get('#search-input').type('test');
            cy.contains('button', 'Search').click();
            cy.get('#suggestion-spinner').should('be.visible');
            cy.get('#suggestion-box').should('be.visible');
      });

      it('should display missing query error when user click search with empty query', () => {
            cy.visit('/docs/dashboard');
            cy.contains('button', 'Search').click();
            cy.contains('Query is required').should('be.visible');
      });
})