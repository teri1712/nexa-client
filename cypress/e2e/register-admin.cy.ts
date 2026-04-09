// ─────────────────────────────────────────────────────────────────────────────
// Feature: Admin Registration (Sign Up)
// Source: backend signup.feature
//
// As an admin, I want to register other admin accounts
// so that I can expand company resource management to other users.
// ─────────────────────────────────────────────────────────────────────────────

describe('Admin Registration', () => {
  beforeEach(() => {
    cy.resetMockServer();
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
    cy.get('#reg-username').type('newadmin01');
    cy.get('#reg-name').type('New Admin One');
    cy.get('#reg-password').type('password123');
    cy.get('#reg-confirm').type('password123');
    cy.contains('Create Admin Account').click();

    cy.contains('"newadmin01" created successfully').should('be.visible');
  });

  it('the newly registered admin can log in with their credentials', () => {
    // Register the new admin
    cy.get('#reg-username').type('freshuser');
    cy.get('#reg-name').type('Fresh User');
    cy.get('#reg-password').type('securepass1');
    cy.get('#reg-confirm').type('securepass1');
    cy.contains('Create Admin Account').click();
    cy.contains('"freshuser" created successfully').should('be.visible');

    // Clear the active admin session before logging in as the new admin
    cy.clearLocalStorage();
    cy.visit('/auth/login');
    cy.contains('Sign in as Admin').should('be.visible');
    cy.contains('Sign in as Admin').click();
    cy.get('#username').type('freshuser');
    cy.get('#password').type('securepass1');
    cy.contains('Sign In').should("be.visible");
    cy.contains('Sign In').click();

    cy.url().should('include', '/profile');
    cy.contains('Fresh User').should('be.visible');
  });

  it('registering an admin with an already-taken username shows a conflict error', () => {
    cy.get('#reg-username').type('superadmin'); // already exists
    cy.get('#reg-name').type('Duplicate Admin');
    cy.get('#reg-password').type('password123');
    cy.get('#reg-confirm').type('password123');
    cy.contains('Create Admin Account').click();

    cy.contains('Username already exists').should('be.visible');
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

