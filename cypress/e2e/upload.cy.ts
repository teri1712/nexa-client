describe('Upload documents', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.loginAsAdmin();
        cy.visit('/docs/dashboard');
    })
    it('should navigate to upload page', () => {
        cy.get('.add-doc-fab').click();
        cy.url().should('include', '/docs/new');
        cy.contains('Add New Document').should('be.visible');
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
        cy.get("[placeholder='Document title']").type("test upload");
        cy.get("[placeholder='Document description']").type("test upload");
        cy.get('mat-select').click();
        cy.contains('mat-option', 'PDF').click();
        cy.get('#file-input').selectFile('cypress/fixtures/cat.jpg', {force: true});
        cy.get('#submit-btn').click();

        cy.contains('Document added successfully').should('be.visible');
    })
})