import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SearchArtist from '../components/SearchArtist';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

vi.mock('../components/SearchResult/ArtistList', () => ({
  default: () => <div data-testid="artist-list-mock" />
}));

vi.mock('../components/SearchResult/TrackList', () => ({
  default: () => <div data-testid="track-list-mock" />
}));

vi.mock('../components/SearchResult/PlaylistList', () => ({
  default: () => <div data-testid="playlist-list-mock" />
}));

describe('SearchArtist component - Unit Tests', () => {
  let mockAxios;
  const mockStore = configureStore([]);
  const store = mockStore({ token: 'mock-token' });

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    
    mockAxios.onGet('https://api.spotify.com/v1/search').reply(200, {
      artists: { items: [{ id: '1', name: 'Artist 1' }] },
      tracks: { items: [{ id: 't1', name: 'Track 1' }] },
      playlists: { items: [{ id: 'p1', name: 'Playlist 1' }] }
    });
  });

  afterEach(() => {
    mockAxios.restore();
    vi.clearAllMocks();
  });

  it('should not render when not logged in', () => {
    const emptyStore = mockStore({ token: null });
    const { container } = render(
      <Provider store={emptyStore}>
        <SearchArtist />
      </Provider>
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render search form when logged in', () => {
    render(
      <Provider store={store}>
        <SearchArtist />
      </Provider>
    );

    expect(screen.getByText('Find by Artist')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Artist name')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Artists')).toBeInTheDocument();
    expect(screen.getByText('Tracks')).toBeInTheDocument();
    expect(screen.getByText('Playlists')).toBeInTheDocument();
  });

  it('should update search state when typing', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <SearchArtist />
        </Provider>
      );
    });

    const input = screen.getByPlaceholderText('Artist name');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Xikers' } });
    });
    expect(input.value).toBe('Xikers');
  });

  it('should change filter when clicking buttons', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <SearchArtist />
        </Provider>
      );
    });
  
    const artistsBtn = screen.getByText('Artists');
    const tracksBtn = screen.getByText('Tracks');
    const playlistsBtn = screen.getByText('Playlists');
  

    await act(async () => {
      fireEvent.click(tracksBtn);
    });
  
    const input = screen.getByPlaceholderText('Artist name');
    const searchBtn = screen.getByText('Search');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Xikers' } });
      fireEvent.click(searchBtn);
    });
  
    expect(await screen.findByTestId('track-list-mock')).toBeInTheDocument();
  
    await act(async () => {
      fireEvent.click(playlistsBtn);
    });
  
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Xikers' } });
      fireEvent.click(searchBtn);
    });
  
    expect(await screen.findByTestId('playlist-list-mock')).toBeInTheDocument();

    await act(async () => {
        fireEvent.click(artistsBtn);
    });

    await act(async () => {
        fireEvent.change(input, { target: { value: 'Xikers' } });
        fireEvent.click(searchBtn);
    });

    expect(await screen.findByTestId('artist-list-mock')).toBeInTheDocument();
  });
  
  
  it('should call API when form is submitted', async () => {
    const mockResponse = {
      artists: { items: [{ id: '1', name: 'Artist 1' }] },
      tracks: { items: [{ id: 't1', name: 'Track 1' }] },
      playlists: { items: [{ id: 'p1', name: 'Playlist 1' }] }
    };
    
    mockAxios.onGet('https://api.spotify.com/v1/search').reply(200, mockResponse);

    await act(async () => {
      render(
        <Provider store={store}>
          <SearchArtist />
        </Provider>
      );
    });

    const input = screen.getByPlaceholderText('Artist name');
    const searchBtn = screen.getByText('Search');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Xikers' } });
      fireEvent.click(searchBtn);
    });

    expect(mockAxios.history.get.length).toBe(1);
    expect(mockAxios.history.get[0].params.q).toBe('artist:Xikers');
  });

  it('should show artist list when artist filter is selected and search is performed', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <SearchArtist />
        </Provider>
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Artists'));
    });

    const input = screen.getByPlaceholderText('Artist name');
    const searchBtn = screen.getByText('Search');
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Xikers' } });
      fireEvent.click(searchBtn);
    });

    expect(screen.getByTestId('artist-list-mock')).toBeInTheDocument();
  });

  it('should show track list when track filter is selected and search is performed', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <SearchArtist />
        </Provider>
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Tracks'));
    });

    const input = screen.getByPlaceholderText('Artist name');
    const searchBtn = screen.getByText('Search');
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Xikers' } });
      fireEvent.click(searchBtn);
    });

    expect(screen.getByTestId('track-list-mock')).toBeInTheDocument();
  });

  it('should show playlist list when playlist filter is selected and search is performed', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <SearchArtist />
        </Provider>
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Playlists'));
    });

    const input = screen.getByPlaceholderText('Artist name');
    const searchBtn = screen.getByText('Search');
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Xikers' } });
      fireEvent.click(searchBtn);
    });

    expect(screen.getByTestId('playlist-list-mock')).toBeInTheDocument();
  });
});