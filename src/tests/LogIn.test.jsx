import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LogIn from '../components/LogIn';

describe('LogIn Component', () => {
  const cryptoMock = {
    getRandomValues: vi.fn(),
    subtle: {
      digest: vi.fn()
    }
  };

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

    vi.stubGlobal('crypto', cryptoMock);

    cryptoMock.getRandomValues.mockImplementation((array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    });

    cryptoMock.subtle.digest.mockResolvedValue(new Uint8Array(32).buffer);
  });

  it('renders the login title and link after setup', async () => {
    render(<LogIn />);

    expect(screen.getByText('Log In to Continue')).toBeInTheDocument();

    const link = await screen.findByText('Login with Spotify');

    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');

    expect(link.getAttribute('href')).toMatch(/^https:\/\/accounts\.spotify\.com\/authorize\?/);

    expect(localStorage.setItem).toHaveBeenCalledWith(expect.stringContaining("code_verifier"), expect.any(String));
  });
});