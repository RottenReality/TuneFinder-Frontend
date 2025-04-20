/* eslint-disable no-undef */
describe('Search Artist', () => {
  const fakeToken = 'fake_token_123';

  before(() => {
    cy.intercept('GET', 'https://api.spotify.com/v1/artists/*', {
      statusCode: 200,
      body: {
        name: "System Of A Down",
        images: [],
        genres: ["nu metal", "metal", "alternative metal", "rap metal"],
        followers: {
          total: 12732682
        }
      }
    }).as('getArtist');

    cy.intercept('GET', 'https://api.spotify.com/v1/artists/*/albums?include_groups=album%2Csingle', {
      statusCode: 200,
      body: {
        items: [{
          id: 1,
          images: [],
          name: "Hypnotize",
          release_date: "2005-11-22"
        },
        {
          id: 2,
          images: [],
          name: "Mezmerize",
          release_date: "2005-05-17"
        }]
      }
    }).as('getAlbums');

    cy.intercept('GET', 'https://api.spotify.com/v1/albums/*/tracks', {
      statusCode: 200,
      body: {
        items: [{
          id: 1,
          name: "Attack",
        },
        {
          id: 2,
          name: "Dreaming",
        }]
      }
    }).as('getTracks');
  })

  beforeEach(() => {

    cy.intercept('GET', 'https://api.spotify.com/v1/me', {
      statusCode: 200,
      body: {
        display_name: 'Cypress Tester',
      },
    }).as('getUserProfile');

    cy.visit('/artist/5eAWCfyUhZtHHtBdNk56l1', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', fakeToken);
      },
    });
  });

  it('should display content page correctly', () => {

    cy.contains('System Of A Down');
    cy.contains('Genres: nu metal / metal / alternative metal / rap metal /');
    cy.contains('Followers: 12732682');
    cy.contains('Hypnotize');
    cy.contains('Mezmerize');
  });
});