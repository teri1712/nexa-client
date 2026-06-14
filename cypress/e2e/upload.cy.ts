describe('Upload documents', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.loginAsAdmin();
        cy.visit('/home/docs/dashboard');
    })
    it('should navigate to upload page', () => {
        cy.get('.add-doc-fab').click();
        cy.url().should('include', '/docs/new');
        cy.contains('Ingest Knowledge').should('be.visible');
    })
    it('should upload document successfully', () => {
        cy.fixture('file-upload-success').then(data => {
            cy.intercept('POST', '**/files/upload**', {statusCode: 200, body: data, delay: 1000})
            cy.intercept('PUT', data.presignedUploadUrl, {
                statusCode: 200, headers: {
                    eTag: "1234567890",
                }, delay: 1000
            })
            cy.fixture('create-doc-success').then(docData => {
                cy.intercept('POST', "**/docs", {statusCode: 200, body: docData, delay: 1000})
                cy.intercept('GET', '**/docs/' + docData.id, {statusCode: 200, body: docData, delay: 1000})
            })

        })
        cy.get('.add-doc-fab').click();
        cy.get("#title").type("test upload");
        cy.get("#description").type("test upload");
        
        // Handle both mat-select and native select for robustness
        cy.get('body').then(($body) => {
            if ($body.find('mat-select').length) {
                cy.get('mat-select').click();
                cy.contains('mat-option', 'PDF').click();
            } else {
                cy.get('select#doc-type').select('PDF');
            }
        });

        cy.get('#file-input').selectFile('cypress/fixtures/cat.jpg', {force: true});
        cy.get('#submit-btn').click();

        cy.contains('Document added successfully', {timeout: 10000}).should('exist');
        cy.contains('Document added successfully').should('be.visible');
    })
})