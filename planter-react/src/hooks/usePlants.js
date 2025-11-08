// src/hooks/usePlants.js
import { useState, useEffect } from 'react';

export default function usePlants() {
  const [plants, setPlants] = useState([]);
  
  useEffect(() => {
    loadPlants();
  }, []);
  
  const loadPlants = () => {
    const storedPlants = JSON.parse(localStorage.getItem('plants')) || [];
    setPlants(storedPlants);
  };
  
  const savePlant = (plant) => {
    const updatedPlants = [...plants, plant];
    localStorage.setItem('plants', JSON.stringify(updatedPlants));
    setPlants(updatedPlants);
    return plant;
  };
  
  const updatePlant = (id, updates) => {
    const updatedPlants = plants.map(p => 
      String(p.id) === String(id) ? { ...p, ...updates } : p
    );
    localStorage.setItem('plants', JSON.stringify(updatedPlants));
    setPlants(updatedPlants);
  };
  
  const deletePlant = (id) => {
    const updatedPlants = plants.filter(p => String(p.id) !== String(id));
    localStorage.setItem('plants', JSON.stringify(updatedPlants));
    setPlants(updatedPlants);
  };
  
  return {
    plants,
    savePlant,
    updatePlant,
    deletePlant,
    loadPlants
  };
}