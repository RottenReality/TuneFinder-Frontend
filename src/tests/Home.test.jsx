import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../components/Home';

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}));

import { useSelector } from 'react-redux';

describe('Home component', () => {
  it('should render nothing if not logged in', () => {
    useSelector.mockImplementation(() => null);

    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render content if logged in', () => {
    useSelector.mockImplementation(() => 'mocked-token');

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('Find by genre')).toBeInTheDocument();
    expect(screen.getByText('Find by artist')).toBeInTheDocument();
    expect(screen.getAllByText('Search')).toHaveLength(2);
  });
});