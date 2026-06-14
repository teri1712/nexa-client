describe('Knowledge Indexing Dashboard', () => {
    const today = new Date().toLocaleDateString('en-CA');

    beforeEach(() => {
        cy.intercept('POST', '**/api/login', { fixture: 'login-success.json' }).as('login');
        cy.intercept('GET', '**/api/profile', { fixture: 'get-profile-success.json' }).as('getProfile');
        cy.visit('/auth/login');
        cy.get('#username').type('admin');
        cy.get('#password').type('password');
        cy.get('button[type="submit"]').click();
        cy.wait('@login');

        cy.intercept('GET', '**/index-logs?page=0&size=10&sort=date,desc', { fixture: 'index-logs-success.json' }).as('getLogs');
    });

    it('should show "Initialize Indexing" when today indexing is not triggered', () => {
        cy.intercept('GET', `**/index-logs/${today}`, { statusCode: 404, body: {} }).as('getTodayStatusNone');
        cy.visit('/home/knowledge/dashboard');
        cy.wait('@getLogs');
        cy.wait('@getTodayStatusNone');
        
        cy.contains('h1', 'Knowledge Management').should('be.visible');
        cy.contains('.status-tag', 'IDLE').should('be.visible');
        cy.contains('button', 'Initialize Indexing').should('be.visible').and('not.be.disabled');
    });

    it('should show "Resume Process" when today indexing has failed', () => {
        cy.intercept('GET', `**/index-logs/${today}`, { fixture: 'index-log-today-failed.json' }).as('getTodayStatusFailed');
        cy.visit('/home/knowledge/dashboard');
        cy.wait('@getLogs');
        cy.wait('@getTodayStatusFailed');

        cy.contains('.status-tag', 'FAILED').should('be.visible');
        cy.contains('button', 'Resume Process').should('be.visible');
    });

    it('should poll status when today indexing is RUNNING', () => {
        let count = 0;
        cy.intercept('GET', `**/index-logs/${today}`, (req) => {
            count++;
            if (count === 1) {
                req.reply({
                    id: 100,
                    date: today,
                    status: 'RUNNING',
                    message: 'Indexing is in progress...'
                });
            } else {
                req.reply({
                    id: 100,
                    date: today,
                    status: 'COMPLETED',
                    message: 'Indexing completed successfully.'
                });
            }
        }).as('getTodayStatusRunning');

        cy.visit('/home/knowledge/dashboard');
        cy.wait('@getLogs');
        cy.contains('.status-tag', 'RUNNING').should('be.visible');
        cy.wait('@getTodayStatusRunning');
        cy.contains('.status-tag', 'COMPLETED').should('be.visible');
    });

    it('should trigger indexing when "Initialize Indexing" is clicked', () => {
        cy.intercept('GET', `**/index-logs/${today}`, { statusCode: 404, body: {} }).as('getTodayStatusNone');
        cy.intercept('POST', '**/index-logs/trigger', { statusCode: 202 }).as('triggerIndexing');
        
        cy.visit('/home/knowledge/dashboard');
        cy.wait('@getLogs');
        cy.contains('button', 'Initialize Indexing').click();
        cy.wait('@triggerIndexing');
    });

    it('should navigate through pages of logs', () => {
        cy.intercept('GET', `**/index-logs/${today}`, { statusCode: 404, body: {} }).as('getTodayStatusNone');
        cy.intercept('GET', '**/index-logs?page=1&size=10&sort=date,desc', {
            content: [],
            totalElements: 15,
            totalPages: 2,
            size: 10,
            number: 1
        }).as('getLogsPage1');

        cy.visit('/home/knowledge/dashboard');
        cy.wait('@getLogs');
        
        cy.get('.pagination button').contains('2').click();
        cy.wait('@getLogsPage1');
        cy.get('.pagination button').contains('2').should('have.class', 'active');
    });
});
