import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlantForm from '../../../components/plants/PlantForm';

test('renders PlantForm component', () => {
  const mockPlant = {
    name: 'Test Plant',
    species: 'Test Species',
    description: '',
    sunAmount: 'full_sun',
    wateringFrequency: '3'
  };
  
  const handleChange = vi.fn();
  const handleSubmit = vi.fn(e => e.preventDefault());
  
  render(
    <PlantForm 
      plant={mockPlant} 
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
  
  expect(screen.getByLabelText(/Plant Name/i)).toHaveValue('Test Plant');
  expect(screen.getByLabelText(/Species/i)).toHaveValue('Test Species');
  
  const submitButton = screen.getByRole('button', { name: /Save Plant/i });
  fireEvent.click(submitButton);
  
  expect(handleSubmit).toHaveBeenCalled();
});