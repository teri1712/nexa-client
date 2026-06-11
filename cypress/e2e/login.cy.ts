// ─────────────────────────────────────────────────────────────────────────────
// Feature: Login
// Source: backend login.feature
//
// As an admin, I want to sign in with my username and password
// so that I can manage company resources.
// ─────────────────────────────────────────────────────────────────────────────

describe('Login', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.visit('/auth/login');
    });

    describe('Admin Access', () => {
        it('an admin can see the admin sign-in form by default', () => {
            cy.contains('Admin Access').should('be.visible');
            cy.get('#username').should('be.visible');
            cy.get('#password').should('be.visible');
        });
    })

    describe('Sign-in Success', () => {
        beforeEach(() => {
            cy.fixture('login-success').then(data => {
                cy.intercept('POST', '**/login', {statusCode: 200, body: data});
            })
        })
        it('should be taken to their dashboard page after signing in with correct credentials', () => {
            cy.get('#username').type('superadmin');
            cy.get('#password').type('superadmin123');
            cy.contains('Sign In').click();

            cy.url().should('include', '/dashboard');
            cy.contains('Super Admin').should('be.visible');
        })
    })

    describe('Sign-in Failure', () => {
        it('should sees a "Wrong password" error when they enter an incorrect password', () => {
            cy.fixture('login-wrong-password').then(data => {
                cy.intercept('POST', '**/login', (req) => {
                    req.reply({statusCode: 401, body: data});
                });
            })
            cy.get('#username').type('superadmin');
            cy.get('#password').type('wrongpassword');
            cy.contains('Sign In').click();

            cy.contains('Wrong password').should('be.visible');
            cy.url().should('include', '/auth/login');
        });

        it('a login attempt with a username that does not exist shows a "Username not found" error', () => {

            cy.fixture('login-user-not-found').then(data => {
                cy.intercept('POST', '**/login', (req) => {
                    req.reply({statusCode: 401, body: data});
                })
            })
            cy.get('#username').type('no_such_user');
            cy.get('#password').type('anypassword');
            cy.contains('Sign In').click();

            cy.contains('Username not found').should('be.visible');
            cy.url().should('include', '/auth/login');
        });
    })


    describe('Validations', () => {
        it('should shows a validation error when the username is too short', () => {
            cy.get('#username').type('ab');
            cy.get('#password').type('somepass');
            cy.contains('Sign In').click();

            cy.contains('Minimum 5 characters').should('be.visible');
        });
    })

});
