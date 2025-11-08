import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import PlantCard from '../../../components/plants/PlantCard';

test('renders PlantCard component', () => {
  const mockPlant = {
    id: 1,
    name: 'Test Plant',
    species: 'Test Species',
    description: 'Test Description',
    sunAmount: 'full_sun',
    wateringFrequency: '3'
  };
  
  const handleDelete = vi.fn();
  const handleEdit = vi.fn();
  const handleToggleFavorite = vi.fn();
  
  render(
    <Router>
      <PlantCard 
        plant={mockPlant}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onToggleFavorite={handleToggleFavorite}
      />
    </Router>
  );
  
  expect(screen.getByText(/Test Plant/i)).toBeInTheDocument();
  expect(screen.getByText(/Test Species/i)).toBeInTheDocument();
  
  // Test delete button
  const deleteButton = screen.getByTestId('delete-icon');
  fireEvent.click(deleteButton);
  expect(handleDelete).toHaveBeenCalledWith(1);
});