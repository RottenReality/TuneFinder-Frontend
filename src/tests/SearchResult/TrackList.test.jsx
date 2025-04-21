/* eslint-disable react/prop-types */
import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Usado para testing
import TrackList from "../../components/SearchResult/TrackList";

vi.mock("../../images/Note.png", () => ({
  default: "note.png",
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
});

describe("TrackList Component", () => {
  const mockTracks = [
    {
      id: "1",
      name: "Test Track",
      duration_ms: 215000,
      album: {
        name: "Test Album",
        images: [{ url: "https://example.com/image.jpg" }],
      },
      artists: [
        { id: "a1", name: "Artist One" },
        { id: "a2", name: "Artist Two" },
      ],
    },
    {
      id: "2",
      name: "Track Without Image",
      duration_ms: 90000,
      album: {
        name: "No Image Album",
        images: [],
      },
      artists: [{ id: "a3", name: "Solo Artist" }],
    },
  ];

  test("renders track information correctly", () => {
    render(
      <MemoryRouter>
        <TrackList tracks={mockTracks} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Test Track")).toBeInTheDocument();
    expect(screen.getByText("Track Without Image")).toBeInTheDocument();
    expect(screen.getByText("Test Album")).toBeInTheDocument();
    expect(screen.getByText("No Image Album")).toBeInTheDocument();

    expect(screen.getByText(/Artist One/i)).toBeInTheDocument();
    expect(screen.getByText(/Artist Two/i)).toBeInTheDocument();
    expect(screen.getByText(/Solo Artist/i)).toBeInTheDocument();

    expect(screen.getByText("3:35 min")).toBeInTheDocument();
    expect(screen.getByText("1:30 min")).toBeInTheDocument();

    const images = screen.getAllByAltText("album logo");
    expect(images[0]).toHaveAttribute("src", "https://example.com/image.jpg");
    expect(images[1]).toHaveAttribute(
      "src",
      expect.stringContaining("note.png"),
    );
  });
});
