// Type declarations for custom Cypress commands.
// Automatically picked up by TypeScript in the cypress/ folder.

declare namespace Cypress {
  interface Chainable {
    /** Resets all mock server data back to its default seeded state */
    resetMockServer(): Chainable<void>;
    /** Logs in as an admin using the credential form */
    loginAsAdmin(username?: string, password?: string): Chainable<void>;
  }
}

