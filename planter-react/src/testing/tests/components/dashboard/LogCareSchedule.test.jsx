import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlantProgress from '/src/pages/plants/PlantProgress';
import { runTest, generateHtmlReport } from '/src/utils/htmlReporter';
import { vi } from 'vitest';

vi.mock('react-chartjs-2', () => ({
  Line: ({ data }) => <div data-testid="line-chart">{JSON.stringify(data)}</div>,
  Bar: ({ data }) => <div data-testid="bar-chart">{JSON.stringify(data)}</div>,
}));

describe('PlantProgress Component – Log Feature', () => {
  const mockPlant = {
    wateringHistory: [
      { date: '2025-04-01', amount: 300 },
      { date: '2025-04-05', amount: 250 },
    ],
    sunlightLog: [
      { date: '2025-04-01', hours: 6 },
      { date: '2025-04-05', hours: 5 },
    ],
  };

  afterAll(() => {
    generateHtmlReport('PlantProgressLogTestOutput.html', 'PlantProgress Log Feature Tests');
  });

  it('renders watering history chart with log data', async () => {
    await runTest('renders watering history chart with log data', async () => {
      render(<PlantProgress plant={mockPlant} />);
      const lineChart = screen.getByTestId('line-chart');

      expect(lineChart).toHaveTextContent('2025-04-01');
      expect(lineChart).toHaveTextContent('300');
      expect(lineChart).toHaveTextContent('250');
    });
  });

  it('renders sunlight history chart with log data', async () => {
    await runTest('renders sunlight history chart with log data', async () => {
      render(<PlantProgress plant={mockPlant} />);
      const barChart = screen.getByTestId('bar-chart');

      expect(barChart).toHaveTextContent('2025-04-01');
      expect(barChart).toHaveTextContent('6');
      expect(barChart).toHaveTextContent('5');
    });
  });
});
