import { expect, vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock global fetch (if needed)
global.fetch = vi.fn();
