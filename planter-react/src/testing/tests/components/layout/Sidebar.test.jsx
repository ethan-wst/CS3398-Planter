import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from '../../../components/layout/Sidebar';

test('renders Sidebar component', () => {
    const { getByTestId } = render(
        <Router>
            <Sidebar />
        </Router>
    );
    const sidebarElement = getByTestId('sidebar');
    expect(sidebarElement).toBeInTheDocument();
});
