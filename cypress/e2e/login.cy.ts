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
    cy.resetMockServer();
    cy.visit('/auth/login');
  });

  // ── Admin credential login ────────────────────────────────────────────────

  it('an admin can open the admin sign-in form by clicking "Sign in as Admin"', () => {
    cy.contains('Sign in as Admin').click();
    cy.contains('Admin Sign in').should('be.visible');
    cy.get('#username').should('be.visible');
    cy.get('#password').should('be.visible');
  });

  it('an admin is taken to their profile page after signing in with correct credentials', () => {
    cy.contains('Sign in as Admin').click();
    cy.get('#username').type('superadmin');
    cy.get('#password').type('superadmin123');
    cy.contains('Sign In').click();

    cy.url().should('include', '/profile');
    cy.contains('Super Admin').should('be.visible');
  });

  it('an admin sees a "Wrong password" error when they enter an incorrect password', () => {
    cy.contains('Sign in as Admin').click();
    cy.get('#username').type('superadmin');
    cy.get('#password').type('wrongpassword');
    cy.contains('Sign In').click();

    cy.contains('Wrong password').should('be.visible');
    cy.url().should('include', '/auth/login');
  });

  it('a login attempt with a username that does not exist shows a "Username not found" error', () => {
    cy.contains('Sign in as Admin').click();
    cy.get('#username').type('no_such_user');
    cy.get('#password').type('anypassword');
    cy.contains('Sign In').click();

    cy.contains('Username not found').should('be.visible');
    cy.url().should('include', '/auth/login');
  });

  it('the form shows a validation error when the username is too short', () => {
    cy.contains('Sign in as Admin').click();
    cy.get('#username').type('ab');
    cy.get('#password').type('somepass');
    cy.contains('Sign In').click();

    cy.contains('Minimum 5 characters').should('be.visible');
  });

  it('an already-logged-in user is redirected away from the login page', () => {
    // Log in first
    cy.contains('Sign in as Admin').click();
    cy.get('#username').type('superadmin');
    cy.get('#password').type('superadmin123');
    cy.contains('Sign In').click();
    cy.url().should('include', '/profile');

    // Revisiting the login page should redirect back
    cy.visit('/auth/login');
    cy.url().should('not.include', '/auth/login');
  });

  // ── Navigation back to Google sign-in ────────────────────────────────────

  it('the admin can go back to the Google sign-in view after opening the admin form', () => {
    cy.contains('Sign in as Admin').click();
    cy.contains('Admin Sign in').should('be.visible');

    cy.contains('Back').click();
    cy.contains('Sign in as Admin').should('be.visible');
  });
});

