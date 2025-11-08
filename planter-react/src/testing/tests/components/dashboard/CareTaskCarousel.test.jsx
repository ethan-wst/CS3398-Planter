import React from 'react'
import { startOfDay, addDays } from 'date-fns';
import { loadPlantsFromStorage, savePlantsToStorage } from '../../../../utils/plantUtils';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CareTaskCarousel from '../../../../components/dashboard/CareTaskCarousel';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../../firebaseConfig';

const renderWithRouter = (ui) => {
  return render(<Router>{ui}</Router>);
};

vi.mock('../../../../utils/plantUtils', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    loadPlantsFromStorage: vi.fn(),
    savePlantsToStorage: vi.fn(),
    formatDateDisplay: vi.fn((date) => date.toISOString()),
  };
});

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

beforeEach(() => {
  useAuthState.mockReturnValue([{ uid: 'test-user' }, false, null]); // Mock user, authLoading, and authError

  const today = startOfDay(new Date()).toISOString();
  const mockPlants = [
    {
      id: '1',
      name: 'Test Plant',
      lastWatered: [], 
      nextWateringDate: today,
      wateringFrequency: '7',
    },
  ];
  loadPlantsFromStorage.mockReturnValue(mockPlants);
});

describe('toggleWateredStatus', () => {
  it('should mark a plant as watered and update its next watering date', async () => {
    const today = startOfDay(new Date());
    const mockPlants = [
      {
        id: '1',
        name: 'Test Plant',
        lastWatered: [],
        wateringFrequency: '7',
      },
    ];
    loadPlantsFromStorage.mockReturnValue(mockPlants);

    renderWithRouter(<CareTaskCarousel />);

    const waterButton = screen.getByRole('button', { name: /Initial watering/i });
    await userEvent.click(waterButton);

    expect(savePlantsToStorage).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: '1',
          lastWatered: expect.arrayContaining([today.toISOString()]),
          nextWateringDate: addDays(today, 7).toISOString(),
        }),
      ])
    );
  });

  it('should unmark a plant as watered if it was already watered today', async () => {
    const today = startOfDay(new Date()).toISOString();
    const mockPlants = [
      {
        id: '1',
        name: 'Test Plant',
        lastWatered: [today],
        nextWateringDate: today,
        wateringFrequency: '7',
      },
    ];
    loadPlantsFromStorage.mockReturnValue(mockPlants);

    renderWithRouter(<CareTaskCarousel />);

    const waterButton = screen.getByRole('button', { name: /Watered/i });
    await userEvent.click(waterButton);

    expect(savePlantsToStorage).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: '1',
          lastWatered: [],
          nextWateringDate: today,
        }),
      ])
    );
  });

  it('should keep the plant displayed after toggling its watered status', async () => {
    const today = startOfDay(new Date()).toISOString();
    const mockPlants = [
      {
        id: '1',
        name: 'Test Plant',
        lastWatered: [],
        nextWateringDate: today,
        wateringFrequency: '7',
      },
    ];
    loadPlantsFromStorage.mockReturnValue(mockPlants);

    renderWithRouter(<CareTaskCarousel />);

    // Verify the plant is initially displayed
    const plantCard = screen.getByText(/Test Plant/i);
    expect(plantCard).toBeInTheDocument();

    // Toggle the watered status
    const waterButton = screen.getByRole('button', { name: /Initial watering/i });
    await userEvent.click(waterButton);

    // Verify the plant is still displayed after toggling
    const plantCardAfterToggle = screen.getByRole('heading', { name: /Test Plant/i });
    expect(plantCardAfterToggle).toBeInTheDocument();
  });
});