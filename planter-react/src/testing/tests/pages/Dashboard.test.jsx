import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from '/src/pages/Dashboard';

// Mock CareTaskCarousel since it depends on localStorage
jest.mock('/src/components/dashboard/CareTaskCarousel', () => {
  return function MockCareTaskCarousel() {
    return <div data-testid="care-task-carousel">Upcoming Care</div>;
  };
});

test('renders Dashboard component', () => {
    const { getByTestId } = render(
      <Router>
        <Dashboard />
      </Router>
    );
    const carouselElement = getByTestId('care-task-carousel');
    expect(carouselElement).toBeInTheDocument();
});
