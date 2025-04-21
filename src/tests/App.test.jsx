import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import App from '../App'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, beforeEach, vi, afterEach, expect } from 'vitest'

const mockStore = configureStore([])



describe('App component', () => {
  let axiosMock
  let localStorageMock = {}

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: (key) => localStorageMock[key],
      setItem: (key, value) => { localStorageMock[key] = value },
      removeItem: (key) => { delete localStorageMock[key] },
      clear: () => { localStorageMock = {} },
    })

    axiosMock = new MockAdapter(axios)
  })

  afterEach(() => {
    axiosMock.reset()
    vi.unstubAllGlobals()
    localStorageMock = {}
  })

  it('loads token from localStorage and dispatches SET_TOKEN if missing in store', async () => {
    localStorage.setItem('token', 'mock-token')

    const store = mockStore({
      token: null,
      user: null
    })

    render(
      <Provider store={store}>
          <App />
      </Provider>
    )

    await waitFor(() => {
      const actions = store.getActions()
      expect(actions).toContainEqual({ type: 'SET_TOKEN', data: 'mock-token' })
    })
  })

  it('renders <Menu /> if token exists', () => {
    const store = mockStore({
      token: 'mock-token',
      user: { display_name: 'Mock User' }
    })

    render(
      <Provider store={store}>
          <App />
      </Provider>
    )

    expect(screen.queryByText(/Log In/i)).not.toBeInTheDocument()
  })

  it('renders <LogIn /> if no token', () => {
    const store = mockStore({
      token: null,
      user: null
    })

    render(
      <Provider store={store}>
          <App />
      </Provider>
    )

    expect(screen.getByText(/Log In/i)).toBeInTheDocument()
  })
})
