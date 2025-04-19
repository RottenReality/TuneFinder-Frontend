import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest'; // <-- Importa afterEach desde vitest
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});