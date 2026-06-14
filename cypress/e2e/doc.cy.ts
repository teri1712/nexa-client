describe('Doc management', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.loginAsAdmin();

        cy.intercept('GET', '/api/docs*', { fixture: 'doc-search-success' }).as('getDocs')
        cy.intercept('POST', '/api/knowledge/ask*', { fixture: 'doc-suggest-success' }).as('getSuggestions')
        cy.intercept('GET', '/api/faqs', { fixture: 'faqs-success' }).as('getFaqs')
    })

    it('should display FAQ chips and trigger search on click', () => {
        cy.visit('/home/docs/dashboard');
        cy.wait('@getFaqs');
        cy.get('.quick-access').should('be.visible');
        cy.contains('Trending FAQs').should('be.visible');
        cy.contains('.chip', 'What is Nexa?').should('be.visible').click();
        cy.get('#search-input').should('have.value', 'What is Nexa?');
        cy.wait('@getDocs');
        cy.get('#results-list', {timeout: 15000}).should('be.visible');
    });

    it('should display list of doc after clicking search', () => {
        cy.visit('/home/docs/dashboard');
        cy.get('#search-input').type('test');
        cy.get('.search-btn').click();
        cy.wait('@getDocs');
        cy.get('#results-list', {timeout: 15000}).should('be.visible');
        cy.contains('financial_report_q1_2025').should('be.visible');
    });

    it('should display suggestion after clicking search', () => {
        cy.visit('/home/docs/dashboard');
        cy.get('#search-input').type('test');
        cy.get('.search-btn').click();
        cy.wait('@getSuggestions');
        cy.get('#suggestion-box', {timeout: 15000}).should('be.visible');
    });

    it('should display missing query error when user click search with empty query', () => {
        cy.visit('/home/docs/dashboard');
        cy.get('.search-btn').click();
        cy.contains('Query is required').should('be.visible');
    });

    it('should display document detail when user click view doc', () => {
        cy.fixture('doc-detail-success').then(data => {
            cy.intercept('GET', '/api/docs/doc_001', {statusCode: 200, body: data}).as('getDocDetail')
        })

        cy.visit('/home/docs/dashboard');
        cy.get('#search-input').type('test');
        cy.get('.search-btn').click();
        cy.wait('@getDocs');
        cy.get('[data-doc-id="doc_001"]', {timeout: 15000}).should('be.visible').click()
        cy.url().should('include', '/docs/doc_001')

        cy.contains('Angular Developer Guide').should('be.visible');
    });
})
