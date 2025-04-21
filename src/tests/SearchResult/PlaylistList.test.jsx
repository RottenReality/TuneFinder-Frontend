import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PlaylistList from "../../components/SearchResult/PlaylistList";

vi.mock("@/images/User.png", () => ({
  default: "User.png",
}));

describe("PlaylistList Component", () => {
  const mockPlaylists = [
    {
      id: "1",
      name: "Test Playlist",
      images: [{ url: "https://example.com/image.jpg" }],
      external_urls: { spotify: "https://example.com/spotify/1" },
      tracks: { total: 5 },
      owner: { display_name: "Name One" },
    },
    {
      id: "2",
      name: "Playlist Without Image",
      images: [],
      external_urls: { spotify: "https://example.com/spotify/2" },
      tracks: { total: 5 },
      owner: { display_name: "Name Two" },
    },
  ];

  test("renders playlist information correctly", () => {
    render(<PlaylistList playlists={mockPlaylists} />);

    expect(screen.getByText("Test Playlist")).toBeInTheDocument();
    expect(screen.getByText("Playlist Without Image")).toBeInTheDocument();

    expect(screen.getByText(/Name One/i)).toBeInTheDocument();
    expect(screen.getByText(/Name Two/i)).toBeInTheDocument();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "https://example.com/spotify/1");
    expect(links[1]).toHaveAttribute("href", "https://example.com/spotify/2");

    const images = screen.getAllByAltText("playlist logo");
    expect(images[0]).toHaveAttribute("src", "https://example.com/image.jpg");
    expect(images[1]).toHaveAttribute(
      "src",
      expect.stringContaining("User.png"),
    );
  });
});
