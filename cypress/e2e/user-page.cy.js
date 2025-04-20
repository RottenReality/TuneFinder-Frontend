/* eslint-disable no-undef */
describe('Search Artist', () => {
  const fakeToken = 'fake_token_123';

  before(() => {
    cy.intercept('GET', 'https://api.spotify.com/v1/me', {
      statusCode: 200,
      body: {
        display_name: 'Cypress Tester',
        images: [],
        followers: {
          total: 3
        }
      },
    }).as('getUserProfile');

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', fakeToken);
      },
    });

    cy.intercept('GET', 'https://api.spotify.com/v1/me/player/currently-playing', {
      statusCode: 200,
      body: {
        item: {
          name: "Karma Bonfire"
        }
      },
    }).as('getCurrentlyPlaying');

    cy.intercept('GET', 'https://api.spotify.com/v1/me/playlists?limit=50', {
      statusCode: 200,
      body: {
        items: [{
          id: 1,
          images: [],
          name: "Metal",
          tracks: {
            total: 43
          }
        },
        {
          id: 2,
          images: [],
          name: "Jazz",
          tracks: {
            total: 23
          }
        }]
      },
    }).as('getPlaylists');

    cy.intercept('GET', 'https://api.spotify.com/v1/me/following?type=artist', {
      statusCode: 200,
      body: {
        artists: {
          total: 10
        }
      },
    }).as('getFollowing');
  })

  it('should display content page correctly', () => {
    cy.contains('Cypress Tester').click()
    cy.contains('Most recently played: Karma Bonfire');
    cy.contains('Followers: 3');
    cy.contains('Followed: 10');
    cy.contains('Metal');
    cy.contains('43 tracks');
    cy.contains('Jazz');
    cy.contains('23 tracks');
  });
});