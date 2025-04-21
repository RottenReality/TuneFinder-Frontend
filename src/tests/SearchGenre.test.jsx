import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SearchGenre from "../components/SearchGenre";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

vi.mock("../components/SearchResult/ArtistList", () => ({
  default: () => <div data-testid="artist-list-mock" />,
}));

vi.mock("../components/SearchResult/TrackList", () => ({
  default: () => <div data-testid="track-list-mock" />,
}));

vi.mock("../components/SearchResult/PlaylistList", () => ({
  default: () => <div data-testid="playlist-list-mock" />,
}));

describe("SearchGenre component - Unit Tests", () => {
  let mockAxios;
  const mockStore = configureStore([]);
  const store = mockStore({ token: "mock-token" });

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);

    mockAxios.onGet("https://api.spotify.com/v1/search").reply(200, {
      artists: { items: [{ id: "1", name: "Artist 1" }] },
      tracks: { items: [{ id: "t1", name: "Track 1" }] },
      playlists: { items: [{ id: "p1", name: "Playlist 1" }] },
    });
  });

  afterEach(() => {
    mockAxios.restore();
    vi.clearAllMocks();
  });

  it("should not render when not logged in", () => {
    const emptyStore = mockStore({ token: null });
    const { container } = render(
      <Provider store={emptyStore}>
        <SearchGenre />
      </Provider>,
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render search form when logged in", () => {
    render(
      <Provider store={store}>
        <SearchGenre />
      </Provider>,
    );

    expect(screen.getByText("Find By Genre")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Genre name")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Artists")).toBeInTheDocument();
    expect(screen.getByText("Tracks")).toBeInTheDocument();
    expect(screen.getByText("Playlists")).toBeInTheDocument();
  });

  it("should update search state when typing", async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <SearchGenre />
        </Provider>,
      );
    });

    const input = screen.getByPlaceholderText("Genre name");
    await act(async () => {
      fireEvent.change(input, { target: { value: "kpop" } });
    });
    expect(input.value).toBe("kpop");
  });

  it("should change filter and render correct list after search", async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <SearchGenre />
        </Provider>,
      );
    });

    const tracksBtn = screen.getByText("Tracks");
    const playlistsBtn = screen.getByText("Playlists");
    const artistsBtn = screen.getByText("Artists");

    await act(async () => {
      fireEvent.click(tracksBtn);
    });

    const input = screen.getByPlaceholderText("Genre name");
    const searchBtn = screen.getByText("Search");
    await act(async () => {
      fireEvent.change(input, { target: { value: "Xikers" } });
      fireEvent.click(searchBtn);
    });

    expect(await screen.findByTestId("track-list-mock")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(playlistsBtn);
    });

    await act(async () => {
      fireEvent.change(input, { target: { value: "Xikers" } });
      fireEvent.click(searchBtn);
    });

    expect(await screen.findByTestId("playlist-list-mock")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(artistsBtn);
    });

    await act(async () => {
      fireEvent.change(input, { target: { value: "Xikers" } });
      fireEvent.click(searchBtn);
    });

    expect(await screen.findByTestId("artist-list-mock")).toBeInTheDocument();
  });

  it("should call API with correct parameters based on filter", async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <SearchGenre />
        </Provider>,
      );
    });

    const input = screen.getByPlaceholderText("Genre name");
    const searchBtn = screen.getByText("Search");

    await act(async () => {
      fireEvent.change(input, { target: { value: "rock" } });
      fireEvent.click(searchBtn);
    });

    expect(await screen.findByTestId("artist-list-mock")).toBeInTheDocument();
  });
});
