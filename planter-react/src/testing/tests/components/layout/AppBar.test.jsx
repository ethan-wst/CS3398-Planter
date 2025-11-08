import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import AppBar from '../../../components/layout/AppBar';

describe('AppBar Component', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <Router>
        <AppBar />
      </Router>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('contains the correct title', () => {
    const { getByText } = render(
      <Router>
        <AppBar title="My App" />
      </Router>
    );
    expect(getByText('My App')).toBeInTheDocument();
  });
});
