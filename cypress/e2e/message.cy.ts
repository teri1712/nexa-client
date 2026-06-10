describe('Messaging with bot', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.loginAsAdmin();
    })
    it('should open message list when user click bot bubble', () => {
        cy.fixture('doc-detail-success').then(data => {
            cy.intercept('GET', 'http://localhost:8080/docs/doc_001', {statusCode: 200, body: data})
        })
        cy.fixture('first-10-messages-success').then(data => {
            cy.intercept('GET', 'http://localhost:8080/messages?anchorSeq=*&docId=doc_001', {statusCode: 200, body: data, delay: 1000})
        })
        cy.visit('/docs/doc_001');
        cy.get('#bot-bubble').click();

        cy.url().should('include', 'docs/doc_001/messages');
        cy.contains('Nexa Intelligence').should('be.visible');
    });
    it('should display full 10 messsage when user open message list', () => {
        cy.fixture('doc-detail-success').then(data => {
            cy.intercept('GET', 'http://localhost:8080/docs/doc_001', {statusCode: 200, body: data})
        })
        cy.fixture('first-10-messages-success').then(data => {
            cy.intercept('GET', 'http://localhost:8080/messages?anchorSeq=*&docId=doc_001', {statusCode: 200, body: data, delay: 1000})
        })
        cy.intercept('GET', 'http://localhost:8080/messages?anchorSeq=1&docId=doc_001', {statusCode: 200, body: [], delay: 1000})
        
        cy.visit('/docs/doc_001');
        cy.get('#bot-bubble').click();

        cy.get('app-message').should('have.length', 10);
    })

    it('should download more message when user scroll up', () => {
        cy.fixture('doc-detail-success').then(data => {
            cy.intercept('GET', 'http://localhost:8080/docs/doc_001', {statusCode: 200, body: data})
        })
        cy.fixture('next-20-messages-from-10-success').then(data => {
            cy.intercept('GET', 'http://localhost:8080/messages?anchorSeq=9007199254740991&docId=doc_001', {statusCode: 200, body: data, delay: 500}).as('getInitialMessages')
        })
        cy.fixture('first-10-messages-success').then(data => {
            cy.intercept('GET', 'http://localhost:8080/messages?anchorSeq=11&docId=doc_001', {statusCode: 200, body: data, delay: 500}).as('getMoreMessages')
        })
        cy.intercept('GET', 'http://localhost:8080/messages?anchorSeq=1&docId=doc_001', {statusCode: 200, body: [], delay: 500})
        
        cy.visit('/docs/doc_001');
        cy.get('#bot-bubble').click();
        cy.wait('@getInitialMessages');

        cy.get('app-message', {timeout: 10000}).should('have.length', 20);
        cy.get('.messages-area').scrollTo('top', {duration: 500});
        cy.wait('@getMoreMessages');
        cy.get('app-message', {timeout: 10000}).should('have.length', 30);
    })

    it('should show sending progress when user click send', () => {
        cy.fixture('doc-detail-success').then(data => {
            cy.intercept('GET', 'http://localhost:8080/docs/doc_001', {statusCode: 200, body: data})
        })
        cy.fixture('first-10-messages-success').then(messages => {
            cy.intercept('GET', 'http://localhost:8080/messages?anchorSeq=*&docId=doc_001', {statusCode: 200, body: messages})
        })
        cy.fixture('send-message-success').then(sendResult => {
            cy.intercept('POST', 'http://localhost:8080/messages**', {statusCode: 200, body: sendResult, delay: 500})
        })
        cy.fixture('bot-response-success').then(data => {
            cy.intercept('POST', 'http://localhost:8080/fill**', {
                statusCode: 200,
                body: data,
                headers: {'Content-Type': 'text/plain'},
                delay: 2000
            })
        })

        cy.visit('/docs/doc_001');
        cy.get('#bot-bubble').click();

        cy.get('#message-input').type('Tell me about Kamen Rider Decade');
        cy.get('#send-btn').click();

        cy.get('#cancel-btn').should('be.visible');
        cy.get('#send-btn').should('not.exist');
    })

    it('should show bot message stream when user ask something', () => {
        cy.fixture('doc-detail-success').then(data => {
            cy.intercept('GET', 'http://localhost:8080/docs/doc_001', {statusCode: 200, body: data})
        })
        cy.fixture('first-10-messages-success').then(messages => {
            cy.intercept('GET', 'http://localhost:8080/messages?anchorSeq=*&docId=doc_001', {statusCode: 200, body: messages})
        })
        cy.fixture('send-message-success').then(sendResult => {
            cy.intercept('POST', 'http://localhost:8080/messages**', {statusCode: 200, body: sendResult})
        })
        cy.fixture('bot-response-success').then(data => {
            cy.intercept('POST', 'http://localhost:8080/bot/fill', {
                statusCode: 200,
                body: data,
                headers: {'Content-Type': 'text/plain'},
                delay: 500
            })
        })

        cy.visit('/docs/doc_001');
        cy.get('#bot-bubble').click();

        cy.get('#message-input').type('Tell me about Kamen Rider Decade');
        cy.get('#send-btn').click();

        cy.contains('Kamen Rider Decade', {timeout: 10000}).should('be.visible');

        cy.get('#send-btn', {timeout: 15000}).should('be.visible');
        cy.get('#cancel-btn').should('not.exist');
    })
})