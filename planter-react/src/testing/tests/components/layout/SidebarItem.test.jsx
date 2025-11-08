import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import SidebarItem from '../../../components/layout/SidebarItem';
import { Dashboard } from '@mui/icons-material';

test('renders SidebarItem component', () => {
    const mockItem = {
        text: 'Test Item',
        path: '/test-path',
        icon: Dashboard,
    };

    const { getByText } = render(
        <Router>
            <SidebarItem sidebarItem={mockItem} />
        </Router>
    );
    const itemElement = getByText(/Test Item/i);
    expect(itemElement).toBeInTheDocument();
});
