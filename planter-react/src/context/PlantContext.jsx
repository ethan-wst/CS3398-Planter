// src/contexts/PlantContext.jsx
import React, { createContext, useContext } from 'react';
import usePlants from '/src/hooks/usePlants';

const PlantContext = createContext();

export const PlantProvider = ({ children }) => {
  const plantUtils = usePlants();
  
  return (
    <PlantContext.Provider value={plantUtils}>
      {children}
    </PlantContext.Provider>
  );
};

export const usePlantContext = () => useContext(PlantContext);