describe('Profile Management', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.loginAsAdmin();
        cy.fixture('user-profile-success').then(data => {
            cy.intercept('PATCH', '**/profiles/me', {statusCode: 200, body: data});
        })
        cy.fixture('get-profile-success').then(data => {
            cy.intercept('GET', '**/profiles/me', {statusCode: 200, body: data})
        })
        cy.fixture('login-success').then(data => {
            cy.intercept('POST', '**/login', req => {
                if (req.body.password === 'newsecurepassword') {
                    req.reply({statusCode: 200, body: data});
                } else {
                    req.continue()
                }
            });
        })
        cy.visit('/home/profile');
    });


    it('should be able to see their name, username, and role on the profile page', () => {
        cy.contains('Super Admin').should('be.visible');
        cy.contains('@superadmin').should('be.visible');
        cy.contains('ADMIN').should('be.visible');
    });

    it('should reflect on the profile page after saving', () => {
        cy.get('#p-name').clear();
        cy.get('#p-name').type('Tetetetete');
        cy.contains('Save Changes').click();

        cy.contains('Profile updated successfully').should('be.visible');
        cy.contains('Tetetetete').should('be.visible');
    });

    it('should show a validation error when the name is cleared and saved', () => {
        cy.get('#p-name').clear();
        cy.contains('Save Changes').click();

        cy.contains('Name is required').should('be.visible');
    });


    it('should be able to navigate to the Security tab to change their password', () => {
        cy.contains('Security & Password').click();
        cy.contains('Change Password').should('be.visible');
        cy.get('#s-current').should('be.visible');
        cy.get('#s-new').should('be.visible');
        cy.get('#s-confirm').should('be.visible');
    });

    it('should change the password with the correct current password keeps the admin logged in and shows a success message', () => {

        cy.fixture('change-password-success').then(data => {
            cy.intercept('POST', '**/profiles/me/password', {statusCode: 200, body: data})
        })

        cy.fixture('login-success').then(data => {
            cy.intercept('POST', '**/login', {statusCode: 200, body: data});
        })

        cy.contains('Security & Password').click();

        cy.get('#s-current').type('superadmin123');
        cy.get('#s-new').type('newsecurepassword');
        cy.get('#s-confirm').type('newsecurepassword');
        cy.contains('Update Password').click();

        // Admin is automatically re-logged in — they stay on the profile page
        cy.url().should('include', '/profile');
        cy.contains('Password changed successfully').should('be.visible');
    });

    it('entering a wrong current password shows an error', () => {

        cy.fixture('change-password-wrong-password').then(data => {
            cy.intercept('POST', '**/profiles/me/password', {statusCode: 400, body: data})
        })


        cy.contains('Security & Password').click();

        cy.get('#s-current').type('wrongcurrentpassword');
        cy.get('#s-new').type('newsecurepassword');
        cy.get('#s-confirm').type('newsecurepassword');
        cy.contains('Update Password').click();

        cy.contains('Wrong password').should('be.visible');
        cy.url().should('include', '/profile');
    });

    it('mismatched new and confirm passwords shows a validation error', () => {
        cy.contains('Security & Password').click();

        cy.get('#s-current').type('superadmin123');
        cy.get('#s-new').type('newpassword1');
        cy.get('#s-confirm').type('differentpassword');
        cy.contains('Update Password').click();

        cy.contains('Passwords do not match').should('be.visible');
    });
});

