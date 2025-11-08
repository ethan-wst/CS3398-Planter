import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import SearchPlantDetails from '/src/pages/Plants/SearchPlantDetails.jsx'; // Adjust the import path as needed
import fs from 'fs';
import path from 'path';

// Mock the fetch API
global.fetch = vi.fn();

describe('SearchPlantDetails Component', () => {

  const outputFilePath = path.join(__dirname, '..', '..', '..', 'documentation', 'searchPlantDetailsTestOutput.html');

  const testResults = [];

  const runTest = async (testName, testFunction) => {
    try {
      await testFunction();
      testResults.push({ name: testName, status: 'passed' });
    } catch (error) {
      testResults.push({ name: testName, status: 'failed', error: error.message });
    }
  };

  const generateHtmlReport = () => {
    const tableRows = testResults.map(result => {
      const statusClass = result.status === 'passed' ? 'passed' : 'failed';
      let errorCell = '';
      if (result.status === 'failed') {
        errorCell = `<td>${result.error}</td>`;
      }
      return `<tr class="${statusClass}"><td>${result.name}</td><td>${result.status}</td>${errorCell}</tr>`;
    }).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Results</title>
        <style>
          body { font-family: sans-serif; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .passed { background-color: #d4edda; }
          .failed { background-color: #f8d7da; }
        </style>
      </head>
      <body>
        <h1>Test Results</h1>
        <table>
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Status</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
      </html>
    `;

    fs.writeFileSync(outputFilePath, html);
    console.log(`Test results written to: ${outputFilePath}`);
  };

  afterAll(() => {
    generateHtmlReport();
  });

  it('renders plant details correctly', async () => {
    await runTest('renders plant details correctly', async () => {
      const mockPlantDetails = {
        watering: 'Frequent',
        sunlight: ['Full sun', 'Partial shade'],
        indoor: true,
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockPlantDetails,
      });

      render(<SearchPlantDetails plantId={1} />);
      await waitFor(() => screen.findByText(/Watering:/));

      expect(screen.getByText('Watering: Frequent')).toBeInTheDocument();
      expect(screen.getByText('Sunlight: Full sun, Partial shade')).toBeInTheDocument();
      expect(screen.getByText('Can be kept indoors: true')).toBeInTheDocument();
    });
  });

  it('handles loading state', async () => {
    await runTest('handles loading state', async () => {
      fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { getByText } = render(<SearchPlantDetails plantId={1} />);
      expect(getByText('Loading plant details...')).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    await runTest('handles error state', async () => {
      fetch.mockRejectedValue(new Error('Failed to fetch'));

      render(<SearchPlantDetails plantId={1} />);
      await waitFor(() => screen.getByText(/Error: Failed to fetch/));

      expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
    });
  });

  it('handles no details returned', async () => {
    await runTest('handles no details returned', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => null,
      });

      render(<SearchPlantDetails plantId={1} />);
      await waitFor(() => expect(screen.queryByText(/Watering:/)).toBeNull());

      expect(screen.queryByText(/Watering:/)).toBeNull();
      expect(screen.queryByText(/Sunlight:/)).toBeNull();
      expect(screen.queryByText(/Can be kept indoors:/)).toBeNull();
    });
  });

  it('handles single sunlight value correctly', async () => {
    await runTest('handles single sunlight value correctly', async () => {
      const mockPlantDetails = {
        watering: 'Frequent',
        sunlight: 'Full sun',
        indoor: true,
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockPlantDetails,
      });

      render(<SearchPlantDetails plantId={1} />);
      await waitFor(() => screen.getByText(/Sunlight: Full sun/));

      expect(screen.getByText('Sunlight: Full sun')).toBeInTheDocument();
    });
  });
});