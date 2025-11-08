import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlantProgress from "/src/pages/plants/PlantProgress"; 
import { runTest, generateHtmlReport } from '/src/utils/htmlReporter';

vi.mock('react-chartjs-2', () => ({
  Line: ({ data }) => <div data-testid="line-chart">{JSON.stringify(data)}</div>,
  Bar: ({ data }) => <div data-testid="bar-chart">{JSON.stringify(data)}</div>,
}));

describe('PlantProgress Component', () => {
  const mockPlant = {
    wateringHistory: [
      { date: '2025-04-10', amount: 200 },
      { date: '2025-04-12', amount: 250 },
    ],
    sunlightLog: [
      { date: '2025-04-10', hours: 5 },
      { date: '2025-04-12', hours: 6 },
    ],
  };

  afterAll(() => {
    generateHtmlReport('PlantProgressVisualTestOutput.html', 'PlantProgress Component Tests');
  });

  it('renders headings', async () => {
    await runTest('renders headings', async () => {
      render(<PlantProgress plant={mockPlant} />);
      expect(screen.getByText('Watering History')).toBeInTheDocument();
      expect(screen.getByText('Sunlight History')).toBeInTheDocument();
    });
  });

  it('renders Line chart with correct watering data', async () => {
    await runTest('renders Line chart with correct watering data', async () => {
      render(<PlantProgress plant={mockPlant} />);
      const lineChart = screen.getByTestId('line-chart');
      expect(lineChart).toHaveTextContent('2025-04-10');
      expect(lineChart).toHaveTextContent('200');
    });
  });

  it('renders Bar chart with sunlight data placeholder', async () => {
    await runTest('renders Bar chart with sunlight data placeholder', async () => {
      render(<PlantProgress plant={mockPlant} />);
      const barChart = screen.getByTestId('bar-chart');
      expect(barChart).toHaveTextContent('Sunlight Exposure');
      expect(barChart).toHaveTextContent('5');
    });
  });
});