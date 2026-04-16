// Type declarations for custom Cypress commands.
// Automatically picked up by TypeScript in the cypress/ folder.

declare namespace Cypress {
      interface Chainable {
            loginAsAdmin(username?: string, password?: string): Chainable<void>;

      }
}

