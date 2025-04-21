import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import UserPage from '../components/UserPage'
import { describe, beforeEach, afterEach, it, expect } from 'vitest'

const mockStore = configureStore([])

const mockUser = {
  display_name: 'Test User',
  followers: { total: 100 },
  images: [{ url: 'https://example.com/user.jpg' }]
}

const mockPlaylists = {
  items: [
    {
      id: '1',
      name: 'Test Playlist',
      tracks: { total: 20 },
      images: [{ url: 'https://example.com/playlist.jpg' }]
    }
  ]
}

const mockFollowing = {
  artists: {
    total: 5
  }
}

const mockPlaying = {
  item: {
    name: 'Test Song'
  }
}

describe('UserPage', () => {
  let axiosMock

  beforeEach(() => {
    axiosMock = new MockAdapter(axios)
  })

  afterEach(() => {
    axiosMock.restore()
  })

  it('renders user info and playlists correctly', async () => {
    const store = mockStore({
      user: mockUser,
      token: 'test-token'
    })

    axiosMock
      .onGet('https://api.spotify.com/v1/me/playlists')
      .reply(200, mockPlaylists)
    axiosMock
      .onGet('https://api.spotify.com/v1/me/following?type=artist')
      .reply(200, mockFollowing)
    axiosMock
      .onGet('https://api.spotify.com/v1/me/player/currently-playing')
      .reply(200, mockPlaying)

    render(
      <Provider store={store}>
        <UserPage />
      </Provider>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
      expect(screen.getByText('Test Playlist')).toBeInTheDocument()
      expect(screen.getByText('Test Song')).toBeInTheDocument()
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })
})
