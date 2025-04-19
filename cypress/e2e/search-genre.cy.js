/* eslint-disable no-undef */
describe('Search Genre', () => {
    const fakeToken = 'fake_token_123';
  
    beforeEach(() => {
  
      cy.intercept('GET', 'https://api.spotify.com/v1/me', {
        statusCode: 200,
        body: {
          display_name: 'Cypress Tester',
        },
      }).as('getUserProfile');
  
      cy.intercept('GET', 'https://api.spotify.com/v1/search?q=genre*', {
        statusCode: 200,
        body: {
          artists: {}
        }
      })
  
      cy.visit('/search-genre', {
        onBeforeLoad(win) {
          win.localStorage.setItem('token', fakeToken);
        },
      });
    });
  
    it('should display content page correctly', () => {
  
      cy.contains('Cypress Tester');
      cy.contains('Find By Genre');
      cy.contains('Artists');
      cy.contains('Tracks');
      cy.contains('Playlists');
    });
  
    it('should find artists with input', () => {
  
      cy.intercept('GET', 'https://api.spotify.com/v1/search?q=genre:*&type=artist', {
        statusCode: 200,
        body: {
          artists: {
            items: [
              {
                id: '1',
                name: 'SOAD',
                images: [],
                genres: ['Metal']
              },
              {
                id: '2',
                name: 'Mike',
                images: [],
                genres: ['Metal']
              }]
          }
        },
      }).as('getArtists');
  
      cy.contains('Artists').click();
      cy.get('input').type('metal{enter}');
      cy.wait('@getArtists');
      cy.contains('SOAD');
      cy.contains('Mike');
      cy.contains('Metal');
      cy.get('img').should('have.length', 2);
    })
  
    it('should find tracks with input', () => {
  
      cy.intercept('GET', 'https://api.spotify.com/v1/search?q=genre:*&type=track', {
        statusCode: 200,
        body: {
          tracks: {
            items: [
              {
                name: 'BYOB',
                duration_ms: 250000,
                artists: [{
                  id: '1',
                  name: 'SOAD'
                }],
                album: {
                  name: 'Steal',
                  images: []
                }
              },
              {
                name: 'Chop',
                duration_ms: 200000,
                artists: [{
                  id: '1',
                  name: 'SOAD'
                }],
                album: {
                  name: 'Tox',
                  images: []
                }
              }
            ]
          }
        },
      }).as('getTracks');
  
      cy.contains('Tracks').click();
      cy.get('input').type('SOAD');
      cy.get('form').submit();
      cy.wait('@getTracks').its('response.statusCode').should('eq', 200);
  
      cy.contains('BYOB');
      cy.contains('Chop');
      cy.contains('Tox');
      cy.get('img').should('have.length', 2);
    })
  
    it('should find playlists with input', () => {
  
      cy.intercept('GET', 'https://api.spotify.com/v1/search?q=*&type=playlist', {
        statusCode: 200,
        body: {
          playlists: {
            items: [
              {
                id: '1',
                images: [],
                name: 'SOAD2025',
                owner: {
                  display_name: 'Sierra'
                },
                external_urls: {
                  spotify: 'url'
                },
                tracks: {
                  total: 10
                }
              },
              {
                id: '2',
                images: [],
                name: 'SysOAD',
                owner: {
                  display_name: 'Juan'
                },
                external_urls: {
                  spotify: 'url'
                },
                tracks: {
                  total: 15
                }
              }
            ]
          }
        },
      }).as('getPlaylists');
  
      cy.contains('Playlists').click();
      cy.get('input').type('SOAD');
      cy.get('form').submit();
      cy.wait('@getPlaylists').its('response.statusCode').should('eq', 200);
  
      cy.contains('Sierra');
      cy.contains('SOAD2025');
      cy.contains('SysOAD');
      cy.contains('10');
      cy.contains('Juan');
      cy.get('img').should('have.length', 2);
    })
  });