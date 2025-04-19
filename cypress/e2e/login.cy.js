/* eslint-disable no-undef */
describe('Spotify Login Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('should show the login prompt on first visit', () => {
    cy.contains('Log In to Continue');
    cy.get('a')
      .contains('Login with Spotify')
      .should('have.attr', 'href')
      .and('include', 'https://accounts.spotify.com/authorize');
  });
});