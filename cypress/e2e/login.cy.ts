// ─────────────────────────────────────────────────────────────────────────────
// Feature: Login
// Source: backend login.feature
//
// As an admin, I want to sign in with my username and password
// so that I can manage company resources.
//
// As a user, I want to sign in with my Google account
// so that I can access the application.
// ─────────────────────────────────────────────────────────────────────────────

describe('Login', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        // Block the real Google GSI script so it cannot overwrite our stub
        cy.intercept('GET', 'https://accounts.google.com/gsi/client', {body: ''});
        cy.visit('/auth/login', {
            onBeforeLoad(win) {
                (win as any).google = {
                    accounts: {
                        id: {
                            initialize(cfg: { callback: (r: { credential: string }) => void }) {
                                (win as any).__googleCallback = cfg.callback;
                            },
                            renderButton(el: HTMLElement) {
                                el.innerHTML = '<span style="pointer-events:none">Sign in with Google</span>';
                                el.style.cssText = 'cursor:pointer;display:flex;align-items:center;justify-content:center;min-height:40px;';
                                el.addEventListener('click', () => {
                                    (win as any).__googleCallback?.({credential: 'fakeIdToken'});
                                });
                            },
                            prompt() {
                            },
                        },
                    },
                };
            }
        });
    });

    describe('Navigating login options', () => {
        it('an admin can open the admin sign-in form by clicking "Sign in as Admin"', () => {
            cy.contains('Sign in as Admin').click();
            cy.contains('Admin Sign in').should('be.visible');
            cy.get('#username').should('be.visible');
            cy.get('#password').should('be.visible');
        });

        it('can go back to the Google sign-in view after opening the admin form', () => {
            cy.contains('Sign in as Admin').click();
            cy.contains('Admin Sign in').should('be.visible');

            cy.contains('Back').click();
            cy.contains('Google').should('be.visible');
        });
    })

    describe('Sign-in Success', () => {
        beforeEach(() => {
            cy.fixture('login-success').then(data => {
                cy.intercept('POST', '**/login', {statusCode: 200, body: data});
            })

            cy.fixture('user-login-success').then(data => {
                cy.intercept('POST', '**/user-login', {statusCode: 200, body: data});
            })
        })
        it('should be taken to their dashboard page after signing in with correct credentials', () => {
            cy.contains('Sign in as Admin').click();
            cy.get('#username').type('superadmin');
            cy.get('#password').type('superadmin123');
            cy.contains('Sign In').click();

            cy.url().should('include', '/dashboard');
            cy.contains('Super Admin').should('be.visible');
        })
        it('should be taken to the dashboard after granting consent from google', () => {
            cy.get('#google-signin-btn').click()
            cy.url().should('include', '/dashboard');

            cy.contains('user1234').should('be.visible');
        })
    })

    describe('Sign-in Failure', () => {
        it('should sees a "Wrong password" error when they enter an incorrect password', () => {
            cy.fixture('login-wrong-password').then(data => {
                cy.intercept('POST', '**/login', (req) => {
                    req.reply({statusCode: 401, body: data});
                });
            })
            cy.contains('Sign in as Admin').click();
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
            cy.contains('Sign in as Admin').click();
            cy.get('#username').type('no_such_user');
            cy.get('#password').type('anypassword');
            cy.contains('Sign In').click();

            cy.contains('Username not found').should('be.visible');
            cy.url().should('include', '/auth/login');
        });
    })


    describe('Validations', () => {
        it('should shows a validation error when the username is too short', () => {
            cy.contains('Sign in as Admin').click();
            cy.get('#username').type('ab');
            cy.get('#password').type('somepass');
            cy.contains('Sign In').click();

            cy.contains('Minimum 5 characters').should('be.visible');
        });
    })

});

