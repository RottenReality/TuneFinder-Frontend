import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ArtistPage from '../components/ArtistPage';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({
      id: 'test-artist-id'
    })
  };
});

vi.mock('../images/User.png', () => ({
  default: 'User.png'
}));
vi.mock('../images/Note.png', () => ({
  default: 'Note.png'
}));

const mockStore = configureStore([]);

const mockArtist = {
  id: 'test-artist-id',
  name: 'Test Artist',
  genres: ['rock', 'pop'],
  followers: { total: 500 },
  images: [{ url: 'https://example.com/artist.jpg' }]
};

const mockAlbums = {
  items: [
    {
      id: 'album-1',
      name: 'Test Album 1',
      release_date: '2020-01-01',
      images: [{ url: 'https://example.com/album1.jpg' }]
    },
    {
      id: 'album-2',
      name: 'Test Album 2',
      release_date: '2022-05-15',
      images: [{ url: 'https://example.com/album2.jpg' }]
    }
  ]
};

const mockTracks1 = {
  items: [
    { id: 'track-1-1', name: 'Track 1 from Album 1' },
    { id: 'track-1-2', name: 'Track 2 from Album 1' }
  ]
};

const mockTracks2 = {
  items: [
    { id: 'track-2-1', name: 'Track 1 from Album 2' },
    { id: 'track-2-2', name: 'Track 2 from Album 2' }
  ]
};

describe('ArtistPage', () => {
  let axiosMock;
  let store;

  beforeEach(() => {
    axiosMock = new MockAdapter(axios);
    store = mockStore({
      token: 'test-token'
    });

    axiosMock
      .onGet('https://api.spotify.com/v1/artists/test-artist-id')
      .reply(200, mockArtist);
    
    axiosMock
      .onGet('https://api.spotify.com/v1/artists/test-artist-id/albums?include_groups=album%2Csingle')
      .reply(200, mockAlbums);
    
    axiosMock
      .onGet('https://api.spotify.com/v1/albums/album-1/tracks')
      .reply(200, mockTracks1);
    
    axiosMock
      .onGet('https://api.spotify.com/v1/albums/album-2/tracks')
      .reply(200, mockTracks2);
  });

  afterEach(() => {
    axiosMock.restore();
  });

  it('renders artist info, albums, and tracks correctly', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/artist/test-artist-id']}>
          <Routes>
            <Route path="/artist/:id" element={<ArtistPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Artist')).toBeInTheDocument();
      
      const genresElement = screen.getByText('Genres:', { exact: false });
      expect(genresElement.parentElement).toHaveTextContent('rock');
      expect(genresElement.parentElement).toHaveTextContent('pop');
      
      const followersElement = screen.getByText('Followers:', { exact: false });
      expect(followersElement.parentElement).toHaveTextContent('500');
      
      expect(screen.getByText('Test Album 1')).toBeInTheDocument();
      expect(screen.getByText('Test Album 2')).toBeInTheDocument();
      
      const releaseDateElements = screen.getAllByText('Release date:', { exact: false });
      expect(releaseDateElements[0].parentElement).toHaveTextContent('2020-01-01');
      expect(releaseDateElements[1].parentElement).toHaveTextContent('2022-05-15');
      
      expect(screen.getByText('- Track 1 from Album 1')).toBeInTheDocument();
      expect(screen.getByText('- Track 2 from Album 1')).toBeInTheDocument();
      expect(screen.getByText('- Track 1 from Album 2')).toBeInTheDocument();
      expect(screen.getByText('- Track 2 from Album 2')).toBeInTheDocument();
    });
  });

  it('renders placeholder images when artist has no images', async () => {
    axiosMock
      .onGet('https://api.spotify.com/v1/artists/test-artist-id')
      .reply(200, { ...mockArtist, images: [] });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/artist/test-artist-id']}>
          <Routes>
            <Route path="/artist/:id" element={<ArtistPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const images = screen.getAllByAltText('Artist Logo');
      expect(images[0].src).toContain('User.png');
    });
  });

  it('renders placeholder images when album has no images', async () => {
    axiosMock
      .onGet('https://api.spotify.com/v1/artists/test-artist-id/albums?include_groups=album%2Csingle')
      .reply(200, {
        items: [
          {
            ...mockAlbums.items[0],
            images: []
          },
          mockAlbums.items[1]
        ]
      });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/artist/test-artist-id']}>
          <Routes>
            <Route path="/artist/:id" element={<ArtistPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const images = screen.getAllByAltText('Artist Logo');
      expect(images[1].src).toContain('Note.png');
    });
  });

  it('does not render genres section when artist has no genres', async () => {
    axiosMock
      .onGet('https://api.spotify.com/v1/artists/test-artist-id')
      .reply(200, { ...mockArtist, genres: [] });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/artist/test-artist-id']}>
          <Routes>
            <Route path="/artist/:id" element={<ArtistPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Genres:')).not.toBeInTheDocument();
    });
  });

  it('renders nothing when token is not available', async () => {
    const emptyStore = mockStore({
      token: null
    });
  
    const { container } = render(
      <Provider store={emptyStore}>
        <MemoryRouter initialEntries={['/artist/test-artist-id']}>
          <Routes>
            <Route path="/artist/:id" element={<ArtistPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });
});