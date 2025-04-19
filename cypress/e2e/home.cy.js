/* eslint-disable no-undef */
describe('Home page', () => {
  const fakeToken = 'fake_token_123';

  beforeEach(() => {
    cy.intercept('GET', 'https://api.spotify.com/v1/me', {
      statusCode: 200,
      body: {
        display_name: 'Cypress Tester',
      },
    }).as('getUserProfile');

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', fakeToken);
      },
    });
  });

  it('should load user data from mocked Spotify API', () => {
    cy.wait('@getUserProfile');
    cy.contains('Cypress Tester');
  });

  it('should navigate to /home and display content', () => {
    cy.visit('/home', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', fakeToken);
      },
    });

    cy.wait('@getUserProfile');
    cy.contains('home');
    cy.contains('Find by genre');
    cy.contains('Find by artist');
    cy.contains('Logout');
  });

  it('should allow user to logout', () => {
    cy.get('.logout-button').click();
    cy.contains('Login with Spotify');
    cy.window().then(win => {
      expect(win.localStorage.getItem('token')).to.eq('');
    });
  });
});