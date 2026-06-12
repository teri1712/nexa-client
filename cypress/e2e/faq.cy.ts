describe('FAQ Management', () => {
    const today = new Date().toISOString().split('T')[0];

    beforeEach(() => {
        cy.clearLocalStorage();
        cy.loginAsAdmin();
        
        // Default intercepts
        cy.intercept('GET', '**/cluster-logs?page=0&size=10&sort=date,desc', { fixture: 'cluster-logs-success.json' }).as('getLogs');
        cy.intercept('GET', `**/cluster-logs/${today}`, { statusCode: 404, body: {} }).as('getTodayStatusNone');
    });

    it('should show "Initialize Cluster" when today cluster is not triggered', () => {
        cy.visit('/faqs/dashboard');
        cy.wait('@getLogs');
        cy.wait('@getTodayStatusNone');

        cy.contains('FAQ Management').should('be.visible');
        cy.contains('IDLE').should('be.visible');
        cy.contains('button', 'Initialize Cluster').should('be.visible').and('not.be.disabled');
    });

    it('should show "Resume Process" when today cluster has failed', () => {
        cy.intercept('GET', `**/cluster-logs/${today}`, { fixture: 'cluster-log-today-failed.json' }).as('getTodayStatusFailed');
        
        cy.visit('/faqs/dashboard');
        cy.wait('@getLogs');
        cy.wait('@getTodayStatusFailed');

        cy.contains('FAILED').should('be.visible');
        cy.contains('button', 'Resume Process').should('be.visible');
    });

    it('should poll status when today cluster is RUNNING', () => {
        let callCount = 0;
        cy.intercept('GET', `**/cluster-logs/${today}`, (req) => {
            callCount++;
            if (callCount === 1) {
                req.reply({
                    id: 3,
                    date: today,
                    status: 'RUNNING',
                    message: 'Clustering is in progress...'
                });
            } else {
                req.reply({
                    id: 3,
                    date: today,
                    status: 'COMPLETED',
                    message: 'Clustering completed successfully.'
                });
            }
        }).as('pollingStatus');

        cy.visit('/faqs/dashboard');
        cy.wait('@pollingStatus');
        cy.contains('RUNNING').should('be.visible');
        
        // Wait for next poll (5 seconds in component, but we can speed up or just wait)
        // In E2E we usually wait for the second call
        cy.wait('@pollingStatus', { timeout: 10000 });
        cy.contains('COMPLETED').should('be.visible');
    });

    it('should trigger cluster when "Initialize Cluster" is clicked', () => {
        cy.intercept('POST', '**/cluster-logs/trigger', { statusCode: 200, body: 'Triggered' }).as('triggerCluster');
        
        cy.visit('/faqs/dashboard');
        cy.contains('button', 'Initialize Cluster').click();
        cy.wait('@triggerCluster');
        
        // Should refetch logs if on page 1 (page 0 in code)
        cy.wait('@getLogs');
    });

    it('should navigate through pages', () => {
        // Override initial logs intercept to show 2 pages
        cy.intercept('GET', '**/cluster-logs?page=0&size=10&sort=date,desc', {
            content: [
                { id: 1, date: today, status: 'COMPLETED', message: 'OK' }
            ],
            totalElements: 13,
            totalPages: 2,
            size: 10,
            number: 0
        }).as('getLogsMultiPage');

        cy.intercept('GET', '**/cluster-logs?page=1&size=10&sort=date,desc', {
            content: [],
            totalElements: 13,
            totalPages: 2,
            size: 10,
            number: 1
        }).as('getLogsPage1');

        cy.visit('/faqs/dashboard');
        cy.wait('@getLogsMultiPage');
        
        // Find pagination button for page 2
        cy.contains('button', '2').click();
        cy.wait('@getLogsPage1');
        
        cy.url().should('include', '/faqs/dashboard');
    });
});
