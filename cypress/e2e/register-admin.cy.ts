// ─────────────────────────────────────────────────────────────────────────────
// Feature: Admin Registration (Sign Up)
// Source: backend signup.feature
//
// As an admin, I want to register other admin accounts
// so that I can expand company resource management to other users.
// ─────────────────────────────────────────────────────────────────────────────

describe('Admin Registration', () => {
      beforeEach(() => {
            cy.clearLocalStorage()
            cy.loginAsAdmin();
            cy.visit('/auth/register-admin');
      });

      it('a logged-in admin sees the registration form', () => {
            cy.contains('Register New Admin').should('be.visible');
            cy.get('#reg-username').should('be.visible');
            cy.get('#reg-name').should('be.visible');
            cy.get('#reg-password').should('be.visible');
            cy.get('#reg-confirm').should('be.visible');
      });

      it('a logged-in admin can successfully register a new admin account', () => {
            cy.fixture('register-admin-success').then(data => {
                  cy.intercept('POST', '**/admins', {statusCode: 201, body: data});
            })

            cy.get('#reg-username').type('newadmin01');
            cy.get('#reg-name').type('New Admin One');
            cy.get('#reg-password').type('password123');
            cy.get('#reg-confirm').type('password123');
            cy.contains('Create Admin Account').click();

            cy.contains('"newadmin01" created successfully').should('be.visible');
      });

      it('registering an admin with an already-taken username shows a conflict error', () => {
            cy.fixture('register-admin-conflict-exist').then(data => {
                  cy.intercept('POST', '**/admins', {statusCode: 409, body: data});
            })


            cy.get('#reg-username').type('superadmin'); // already exists
            cy.get('#reg-name').type('Duplicate Admin');
            cy.get('#reg-password').type('password123');
            cy.get('#reg-confirm').type('password123');
            cy.contains('Create Admin Account').click();

            cy.contains('User already exist').should('be.visible');
      });

      it('the form shows a validation error when passwords do not match', () => {
            cy.get('#reg-username').type('validuser1');
            cy.get('#reg-name').type('Valid User');
            cy.get('#reg-password').type('password123');
            cy.get('#reg-confirm').type('differentpassword');
            cy.contains('Create Admin Account').click();

            cy.contains('Passwords do not match').should('be.visible');
      });

      it('the form shows a validation error when the username is shorter than 5 characters', () => {
            cy.get('#reg-username').type('abc');
            cy.get('#reg-name').type('Some Name');
            cy.get('#reg-password').type('password123');
            cy.get('#reg-confirm').type('password123');
            cy.contains('Create Admin Account').click();

            cy.contains('At least 5 characters').should('be.visible');
      });

      it('an unauthenticated visitor cannot access the register admin page', () => {
            // Clear the session to simulate a logged-out state
            cy.clearLocalStorage();
            cy.visit('/auth/register-admin');

            // Guard should redirect to login
            cy.url().should('include', '/auth/login');
      });
});

