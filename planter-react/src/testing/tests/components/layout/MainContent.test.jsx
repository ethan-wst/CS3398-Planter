import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainContent from '/src/components/layout/MainContent';

test('renders MainContent component', () => {
    const { getByText } = render(<MainContent open={true}>Test Content</MainContent>);
    const contentElement = getByText(/Test Content/i);
    expect(contentElement).toBeInTheDocument();
});
