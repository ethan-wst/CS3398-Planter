// test-utils/htmlReporter.js
import fs from 'fs';
import path from 'path';

const testResults = [];

export const runTest = async (testName, testFunction) => {
  try {
    await testFunction();
    testResults.push({ name: testName, status: 'passed' });
  } catch (error) {
    testResults.push({ name: testName, status: 'failed', error: error.message });
  }
};

export const generateHtmlReport = (filename = 'test-report.html', title = 'Test Results') => {
  const outputFilePath = path.join(process.cwd(), 'src', 'testing', 'documentation', filename);

  const tableRows = testResults.map(result => {
    const statusClass = result.status === 'passed' ? 'passed' : 'failed';
    let errorCell = result.status === 'failed' ? `<td>${result.error}</td>` : `<td></td>`;
    return `<tr class="${statusClass}"><td>${result.name}</td><td>${result.status}</td>${errorCell}</tr>`;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
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
      <h1>${title}</h1>
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
  console.log(`Test results saved to: ${outputFilePath}`);
};
