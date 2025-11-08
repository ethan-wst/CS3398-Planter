import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthPage from '/src/pages/AuthPage';
import { vi } from 'vitest';
import { runTest, generateHtmlReport } from '/src/utils/htmlReporter';

//Mock Firebase Auth hook
vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: () => [null], // Simulate logged out user
}));

//Mock navigation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

//Mock Auth buttons
vi.mock('/src/components/ui/AuthButtons', () => ({
  LoginButton: ({ email, password, setError }) => (
    <button data-testid="login-button" onClick={() => setError("")}>
      Login
    </button>
  ),
  RegisterButton: ({ email, name, password, confirmPassword, setError }) => (
    <button data-testid="register-button" onClick={() => setError("")}>
      Register
    </button>
  ),
}));

describe('AuthPage Component – Visual/Interaction Tests', () => {
  afterAll(() => {
    generateHtmlReport('AuthPageVisualTestOutput.html', 'AuthPage Visual Tests');
  });

  it('renders login form by default', async () => {
    await runTest('renders login form by default', async () => {
      render(<AuthPage />);
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getAllByText('Login')).toHaveLength(2); 
    });
  });

  it('toggles to registration form when clicking register link', async () => {
    await runTest('toggles to registration form', async () => {
      render(<AuthPage />);
      fireEvent.click(screen.getByText(/Register here/i));

      expect(screen.getByText('Create an Account')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByTestId('register-button')).toBeInTheDocument();
    });
  });

  it('updates input fields on user typing', async () => {
    await runTest('updates input fields', async () => {
      render(<AuthPage />);
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '123456' } });

      expect(emailInput.value).toBe('test@example.com');
      expect(passwordInput.value).toBe('123456');
    });
  });
});
