import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent } from '@mui/material';

import PlantForm from '/src/components/plants/PlantForm';
import { loadPlantsFromStorage, savePlantsToStorage } from '/src/utils/plantUtils';

const EditPlant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState({
    name: '',
    species: '',
    description: '',
    wateringFrequency: '3',
    sunAmount: 'full_sun',
  });

  useEffect(() => {
    const plants = loadPlantsFromStorage();
    const foundPlant = plants.find((p) => String(p.id) === String(id));
    if (foundPlant) {
      setPlant(foundPlant);
    }
  }, [id]);

  const handleChange = (e) => {
    setPlant(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const plants = loadPlantsFromStorage();
    const updatedPlants = plants.map(p =>
      String(p.id) === String(id) ? { ...p, ...plant } : p
    );
    
    savePlantsToStorage(updatedPlants);
    navigate(`/plant/${id}`);
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 4, mb: 4 }}>
        <CardContent>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
            Edit Plant
          </Typography>
          
          <PlantForm
            plant={plant}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitButtonText="Save Changes"
          />
        </CardContent>
      </Card>
    </Container>
  );
};

export default EditPlant;