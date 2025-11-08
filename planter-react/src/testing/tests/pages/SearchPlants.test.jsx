import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import SearchPlants from '/src/pages/SearchPlants';
import fs from 'fs'; // Import Node.js file system module
const path = require('path');

// Mock the SavePlants component
vi.mock('/src/components/plants/SavePlants', () => ({
  default: () => <div data-testid="save-plants">Save Plants Mock</div>,
}));

beforeEach(() => {
  vi.restoreAllMocks();
});

// Mock fetch to return a controlled response using Vitest's vi.fn()
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        data: [
          {
            id: 1,
            common_name: 'Rose',
            default_image: { small_url: 'rose.jpg' },
          },
        ],
        last_page: 1,
      }),
  })
);

test('renders SearchPlants and displays search results', async () => {
  const { container } = render(<SearchPlants />);

  // Simulate user typing a plant name
  const input = screen.getByPlaceholderText(/Look for a plant/i);
  fireEvent.change(input, { target: { value: 'Rose' } });

  // Simulate clicking the search button
  const button = screen.getByRole('button', { name: /send it/i });
  fireEvent.click(button);

  // Wait for the asynchronous update: The component updates the DOM when the fetch completes.
  await waitFor(() => {
    expect(screen.getByText(/Rose/i)).toBeInTheDocument();
  });

  // Generate HTML report
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Test Results</title>
      </head>
      <body>
        <h1>Test Results</h1>
        <p>Test: renders SearchPlants and displays search results</p>
        <p>Result: Passed</p>
        <div>
        <h2>Component HTML:</h2>
        ${container.innerHTML}
        </div>
      </body>
    </html>
  `;

   // Calculate the path to the "documentation" directory
   const reportsDir = path.join(__dirname, '..', '..', 'documentation'); // Go up two levels from "pages"

   // Construct the full file path
   const htmlFilePath = path.join(reportsDir, 'searchPlantsTestOutput.html');

   // Create the "documentation" directory if it doesn't exist
   fs.mkdirSync(reportsDir, { recursive: true });

   // Write the HTML to the file
   fs.writeFileSync(htmlFilePath, html);

   console.log(`Test results written to ${htmlFilePath}`);
});