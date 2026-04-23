describe('Messaging with bot', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.loginAsAdmin();
    })
    it('should open message list when user click bot bubble', () => {
        cy.fixture('first-10-messages-success').then(data => {
            cy.intercept('GET', '**/messages**', {statusCode: 200, body: data, delay: 1000})
        })
        cy.visit('/docs/dashboard');
        cy.get('#bot-bubble').click();

        cy.url().should('include', 'messages');
        cy.contains('Nexa bot').should('be.visible');
    });
    it('should display full 10 messsage when user open message list', () => {
        cy.fixture('first-10-messages-success').then(data => {
            cy.intercept('GET', '**/messages**', {statusCode: 200, body: data, delay: 1000})
            cy.intercept('GET', '**/messages?anchorSeq=1', {statusCode: 200, body: [], delay: 1000})
        })
        cy.fixture('first-10-messages-success').then(data => {
            cy.intercept('GET', '**/messages?anchorSeq=1', {statusCode: 200, body: [], delay: 1000})
        })
        cy.visit('/docs/dashboard');
        cy.get('#bot-bubble').click();

        cy.get('app-message').should('have.length', 10);
    })

    it('should download more message when user scroll up', () => {

        cy.fixture('next-20-messages-from-10-success').then(data => {
            cy.intercept('GET', '**/messages**', {statusCode: 200, body: data, delay: 2000})
        })
        cy.fixture('first-10-messages-success').then(data => {
            cy.intercept('GET', '**/messages?anchorSeq=11', {statusCode: 200, body: data, delay: 1000})
        })
        cy.intercept('GET', '**/messages?anchorSeq=1', {statusCode: 200, body: [], delay: 1000})
        cy.visit('/docs/dashboard');
        cy.get('#bot-bubble').click();

        cy.get('app-message').should('have.length', 20);
        cy.get('.messages-area').scrollTo('top');
        cy.get('app-message').should('have.length', 30);
    })

    it('should show sending progress when user click send', () => {
        cy.fixture('first-10-messages-success').then(messages => {
            cy.intercept('GET', '**/messages**', {statusCode: 200, body: messages})
        })
        cy.fixture('send-message-success').then(sendResult => {
            cy.intercept('POST', '**/messages**', {statusCode: 200, body: sendResult, delay: 500})
        })
        cy.fixture('bot-response-success').then(data => {
            cy.intercept('POST', '**/fill**', {
                statusCode: 200,
                body: data,
                headers: {'Content-Type': 'text/plain'},
                delay: 2000
            })
        })

        cy.visit('/docs/dashboard');
        cy.get('#bot-bubble').click();

        cy.get('#message-input').type('Tell me about Kamen Rider Decade');
        cy.get('#send-btn').click();

        cy.get('#cancel-btn').should('be.visible');
        cy.get('#send-btn').should('not.exist');
    })

    it('should show bot message stream when user ask something', () => {
        cy.fixture('first-10-messages-success').then(messages => {
            cy.intercept('GET', '**/messages**', {statusCode: 200, body: messages})
        })
        cy.fixture('send-message-success').then(sendResult => {
            cy.intercept('POST', '**/messages**', {statusCode: 200, body: sendResult})
        })
        cy.fixture('bot-response-success').then(data => {
            cy.intercept('POST', '**/fill**', {
                statusCode: 200,
                body: data,
                headers: {'Content-Type': 'text/plain'},
                delay: 500
            })
        })

        cy.visit('/docs/dashboard');
        cy.get('#bot-bubble').click();

        cy.get('#message-input').type('Tell me about Kamen Rider Decade');
        cy.get('#send-btn').click();

        cy.fixture('bot-response-success').then(data => {
            cy.contains(data).should('be.visible');
        })

        cy.get('#send-btn').should('be.visible');
        cy.get('#cancel-btn').should('not.exist');
    })
})