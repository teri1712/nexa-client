// ─────────────────────────────────────────────────────────────────────────────
// Feature: Profile Management
// Source: backend profile.feature
//
// As a user, I want to update my profile and password
// so that I can keep my information up to date and protect my account.
// ─────────────────────────────────────────────────────────────────────────────

describe('Profile Management', () => {
  beforeEach(() => {
    cy.resetMockServer();
    cy.loginAsAdmin();
    // loginAsAdmin navigates to /profile, so we're already there
  });

  // ── Viewing profile ───────────────────────────────────────────────────────

  it('a logged-in admin can see their name, username, and role on the profile page', () => {
    cy.contains('Super Admin').should('be.visible');
    cy.contains('@superadmin').should('be.visible');
    cy.contains('ADMIN').should('be.visible');
  });

  // ── Updating profile info ─────────────────────────────────────────────────

  it('an admin can update their display name and sees a success confirmation', () => {
    cy.get('#p-name').clear();
    cy.get('#p-name').type('Updated Admin Name');
    cy.contains('Save Changes').click();

    cy.contains('Profile updated successfully').should('be.visible');
  });

  it('the updated name is reflected on the profile page after saving', () => {
    cy.get('#p-name').clear();
    cy.get('#p-name').type('Tetetetete');
    cy.contains('Save Changes').click();

    cy.contains('Profile updated successfully').should('be.visible');
    // The hero section should reflect the new name
    cy.contains('Tetetetete').should('be.visible');
  });

  it('the form shows a validation error when the name is cleared and saved', () => {
    cy.get('#p-name').clear();
    cy.contains('Save Changes').click();

    cy.contains('Name is required').should('be.visible');
  });

  // ── Changing password ─────────────────────────────────────────────────────

  it('an admin can navigate to the Security tab to change their password', () => {
    cy.contains('Security').click();
    cy.contains('Change Password').should('be.visible');
    cy.get('#s-current').should('be.visible');
    cy.get('#s-new').should('be.visible');
    cy.get('#s-confirm').should('be.visible');
  });

  it('changing the password with the correct current password keeps the admin logged in and shows a success message', () => {
    cy.contains('Security').click();

    cy.get('#s-current').type('superadmin123');
    cy.get('#s-new').type('newsecurepassword');
    cy.get('#s-confirm').type('newsecurepassword');
    cy.contains('Update Password').click();

    // Admin is automatically re-logged in — they stay on the profile page
    cy.url().should('include', '/profile');
    cy.contains('Password changed successfully').should('be.visible');
  });

  it('after changing the password the admin can log out and log back in with the new password', () => {
    // Change the password
    cy.contains('Security').click();
    cy.get('#s-current').type('superadmin123');
    cy.get('#s-new').type('brandnewpassword');
    cy.get('#s-confirm').type('brandnewpassword');
    cy.contains('Update Password').click();

    // Admin stays on profile — now manually log out
    cy.url().should('include', '/profile');
    cy.contains('Sign out').click();

    // Log in with the new password
    cy.contains('Sign in as Admin').click();
    cy.get('#username').type('superadmin');
    cy.get('#password').type('brandnewpassword');
    cy.contains('Sign In').click();

    cy.url().should('include', '/profile');
    cy.contains('Super Admin').should('be.visible');
  });

  it('entering a wrong current password shows an error', () => {
    cy.contains('Security').click();

    cy.get('#s-current').type('wrongcurrentpassword');
    cy.get('#s-new').type('newsecurepassword');
    cy.get('#s-confirm').type('newsecurepassword');
    cy.contains('Update Password').click();

    cy.contains('Wrong password').should('be.visible');
    cy.url().should('include', '/profile');
  });

  it('mismatched new and confirm passwords shows a validation error', () => {
    cy.contains('Security').click();

    cy.get('#s-current').type('superadmin123');
    cy.get('#s-new').type('newpassword1');
    cy.get('#s-confirm').type('differentpassword');
    cy.contains('Update Password').click();

    cy.contains('Passwords do not match').should('be.visible');
  });
});

