describe('Citation Chips', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.loginAsAdmin();

        cy.intercept('GET', '/api/docs*', { fixture: 'doc-search-success' }).as('getDocs')
        cy.intercept('POST', '/api/knowledge/ask*', { fixture: 'citation-success' }).as('getSuggestions')
        cy.intercept('GET', '/api/faqs', { fixture: 'faqs-success' }).as('getFaqs')
    })

    it('should display chip when server return citation', () => {
        cy.visit('/home/docs/dashboard');
        cy.get('#search-input').type('decade');
        cy.get('.search-btn').click();
        cy.wait('@getSuggestions');
        
        cy.get('#suggestion-box').within(() => {
            cy.get('.citation-chip').should('be.visible').and('contain', 'financial_report.pdf');
        });
    });

    it('should be able to nav to doc when clicking to those chip', () => {
        cy.fixture('doc-detail-success').then(data => {
            cy.intercept('GET', '/api/docs/doc001', {statusCode: 200, body: data}).as('getDocDetail')
        })

        cy.visit('/home/docs/dashboard');
        cy.get('#search-input').type('decade');
        cy.get('.search-btn').click();
        cy.wait('@getSuggestions');
        
        cy.get('.citation-chip').first().click();
        
        cy.url().should('include', '/home/docs/doc001');
        cy.contains('Angular Developer Guide').should('be.visible');
    });
})
