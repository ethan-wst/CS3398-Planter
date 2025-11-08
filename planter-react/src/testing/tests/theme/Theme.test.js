import createCustomTheme from '/src/theme/theme.js';
import fs from 'fs';
import path from 'path';

describe('createCustomTheme', () => {
  let testResults = [];

  afterAll(() => {
    const htmlReport = generateHtmlReport(testResults);
    const outputPath = path.join(__dirname, '..', '..', 'documentation', 'themeTestOutput.html'); // Default path or from environment variable
    fs.writeFileSync(outputPath, htmlReport);
    console.log(`Test report generated: ${outputPath}`);
  });

  it('should create a light theme when useLightTheme is true', () => {
    const lightTheme = createCustomTheme(true);
    let results = [];

    results.push({
      description: 'lightTheme.palette.primary.main should be #50715c',
      actual: lightTheme.palette.primary.main,
      expected: '#50715c',
      passed: lightTheme.palette.primary.main === '#50715c',
    });
    results.push({
      description: 'lightTheme.palette.secondary.main should be #ffffff',
      actual: lightTheme.palette.secondary.main,
      expected: '#ffffff',
      passed: lightTheme.palette.secondary.main === '#ffffff',
    });
    results.push({
      description: 'lightTheme.palette.sidebar.main should be #8fae9a',
      actual: lightTheme.palette.sidebar.main,
      expected: '#8fae9a',
      passed: lightTheme.palette.sidebar.main === '#8fae9a',
    });
    results.push({
      description: 'lightTheme.palette.background.default should be #f0f0f0',
      actual: lightTheme.palette.background.default,
      expected: '#f0f0f0',
      passed: lightTheme.palette.background.default === '#f0f0f0',
    });
    results.push({
      description: 'lightTheme.palette.background.paper should be #ffffff',
      actual: lightTheme.palette.background.paper,
      expected: '#ffffff',
      passed: lightTheme.palette.background.paper === '#ffffff',
    });
    results.push({
      description: 'lightTheme.palette.text.primary should be #333333',
      actual: lightTheme.palette.text.primary,
      expected: '#333333',
      passed: lightTheme.palette.text.primary === '#333333',
    });
    results.push({
      description: 'lightTheme.palette.text.secondary should be #777777',
      actual: lightTheme.palette.text.secondary,
      expected: '#777777',
      passed: lightTheme.palette.text.secondary === '#777777',
    });
    results.push({
      description: 'lightTheme should be defined',
      actual: lightTheme,
      expected: 'defined',
      passed: typeof lightTheme !== 'undefined',
    });
    results.push({
      description: 'lightTheme.palette should be defined',
      actual: lightTheme.palette,
      expected: 'defined',
      passed: typeof lightTheme.palette !== 'undefined',
    });
    testResults.push({ title: 'should create a light theme when useLightTheme is true', results });
    results.forEach(({ passed, description }) => expect(passed).toBe(true))

  });

  it('should create a dark theme when useLightTheme is false', () => {
    const darkTheme = createCustomTheme(false);
    let results = [];

    results.push({
      description: 'darkTheme.palette.primary.main should be #2e8b57',
      actual: darkTheme.palette.primary.main,
      expected: '#2e8b57',
      passed: darkTheme.palette.primary.main === '#2e8b57',
    });
    results.push({
      description: 'darkTheme.palette.secondary.main should be #e8e8e8',
      actual: darkTheme.palette.secondary.main,
      expected: '#e8e8e8',
      passed: darkTheme.palette.secondary.main === '#e8e8e8',
    });
    results.push({
      description: 'darkTheme.palette.sidebar.main should be #27774a',
      actual: darkTheme.palette.sidebar.main,
      expected: '#27774a',
      passed: darkTheme.palette.sidebar.main === '#27774a',
    });
    results.push({
      description: 'darkTheme.palette.background.default should be #282828',
      actual: darkTheme.palette.background.default,
      expected: '#282828',
      passed: darkTheme.palette.background.default === '#282828',
    });
    results.push({
      description: 'darkTheme.palette.background.paper should be #3c3c3c',
      actual: darkTheme.palette.background.paper,
      expected: '#3c3c3c',
      passed: darkTheme.palette.background.paper === '#3c3c3c',
    });
    results.push({
      description: 'darkTheme.palette.text.primary should be #ffffff',
      actual: darkTheme.palette.text.primary,
      expected: '#ffffff',
      passed: darkTheme.palette.text.primary === '#ffffff',
    });
    results.push({
      description: 'darkTheme.palette.text.secondary should be #cccccc',
      actual: darkTheme.palette.text.secondary,
      expected: '#cccccc',
      passed: darkTheme.palette.text.secondary === '#cccccc',
    });
    results.push({
      description: 'darkTheme should be defined',
      actual: darkTheme,
      expected: 'defined',
      passed: typeof darkTheme !== 'undefined',
    });
    results.push({
      description: 'darkTheme.palette should be defined',
      actual: darkTheme.palette,
      expected: 'defined',
      passed: typeof darkTheme.palette !== 'undefined',
    });

    testResults.push({ title: 'should create a dark theme when useLightTheme is false', results });
    results.forEach(({ passed, description }) => expect(passed).toBe(true))

  });

  it('should return a Theme object', () => {
    const theme = createCustomTheme(true);
    let results = [];
    results.push({
      description: 'theme should be defined',
      actual: theme,
      expected: 'defined',
      passed: typeof theme !== 'undefined',
    });
    results.push({
      description: 'theme.palette should be defined',
      actual: theme.palette,
      expected: 'defined',
      passed: typeof theme.palette !== 'undefined',
    });
    testResults.push({ title: 'should return a Theme object', results });
    results.forEach(({ passed, description }) => expect(passed).toBe(true))

  });

  it('should return a Theme object when useLightTheme is false', () => {
    const theme = createCustomTheme(false);
    let results = [];
    results.push({
      description: 'theme should be defined',
      actual: theme,
      expected: 'defined',
      passed: typeof theme !== 'undefined',
    });
    results.push({
      description: 'theme.palette should be defined',
      actual: theme.palette,
      expected: 'defined',
      passed: typeof theme.palette !== 'undefined',
    });
    testResults.push({ title: 'should return a Theme object when useLightTheme is false', results });
    results.forEach(({ passed, description }) => expect(passed).toBe(true))

  });
});

function generateHtmlReport(testResults) {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Theme Test Report</title>
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
      <h1>Theme Test Report</h1>
      <table>
        <thead>
          <tr>
            <th>Test Description</th>
            <th>Result</th>
            <th>Expected</th>
            <th>Actual</th>
          </tr>
        </thead>
        <tbody>
  `;

  testResults.forEach(({ title, results }) => {
    html += `<tr><td colspan="4"><strong>${title}</strong></td></tr>`;
    results.forEach(({ description, passed, expected, actual }) => {
      html += `<tr class="${passed ? 'passed' : 'failed'}">
        <td>${description}</td>
        <td>${passed ? 'Passed' : 'Failed'}</td>
        <td>${expected}</td>
        <td>${actual}</td>
      </tr>`;
    });
  });

  html += `
        </tbody>
      </table>
    </body>
    </html>
  `;
  return html;
}