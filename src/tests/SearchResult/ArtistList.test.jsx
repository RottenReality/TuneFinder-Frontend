import { describe, test, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ArtistList from '../../components/SearchResult/ArtistList';

vi.mock('../../images/User.png', () => ({
  default: 'User.png'
}));

describe('ArtistList Component', () => {
  const mockArtists = [
    {
      id: '1',
      name: 'Artist One',
      images: [{}, {}, { url: 'https://example.com/artist1.jpg' }],
      genres: ['pop', 'rock'],
    },
    {
      id: '2',
      name: 'Artist Two',
      images: [],
      genres: [],
    }
  ];

  test('renders artists information correctly', () => {
    render(
      <MemoryRouter>
        <ArtistList artists={mockArtists} />
      </MemoryRouter>
    );

    expect(screen.getByText('Artist One')).toBeInTheDocument();
    expect(screen.getByText('Artist Two')).toBeInTheDocument();

    const images = screen.getAllByAltText('Artist Logo');
    expect(images[0]).toHaveAttribute('src', 'https://example.com/artist1.jpg');
    expect(images[1]).toHaveAttribute('src', expect.stringContaining('User.png'));

    expect(screen.getByText(/Genres:/i)).toBeInTheDocument();
    expect(screen.getByText('pop /')).toBeInTheDocument();
    expect(screen.getByText('rock /')).toBeInTheDocument();

    const artistLinks = screen.getAllByRole('link');
    expect(artistLinks[0]).toHaveAttribute('href', '/artist/1');
    expect(artistLinks[1]).toHaveAttribute('href', '/artist/2');
  });
});