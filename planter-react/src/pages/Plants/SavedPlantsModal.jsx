import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Paper, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import '/src/theme/pages/SavedPlantsModal.css';
import { loadPlantsFromStorage } from '/src/utils/plantUtils.js'; // Assuming you have a function to get saved plants

function SavedPlantsModal({ onClose, onSelect }) {
  const [savedPlants, setSavedPlants] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchSavedPlants = async () => {
      try {
        const plants = await loadPlantsFromStorage();
        setSavedPlants(plants);
      } catch (error) {
        console.error("Error fetching saved plants:", error);
      }
    };

    fetchSavedPlants();
  }, []);

  return (
        <Box
          sx={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1300,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
          }}
        >
          <Paper
            sx={{
              width: '100%',
              maxWidth: 500,
              maxHeight: '80vh',
              overflowY: 'auto',
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderRadius: 5,
              p: 3,
              boxShadow: 6,
              position: 'relative',
            }}
          >
        

        <Box
            sx={{
              width: '100%',
              backgroundColor: 'primary.main',
              borderTopLeftRadius: '20px',
              paddingY: 2,
              color: 'common.white', 
              marginX: -3, 
              marginTop: -3,
              marginBottom: 3,
              textAlign: 'center',
            }}
        >

        <Typography variant="h5" gutterBottom fontWeight="bold"> 
          Saved Plants
        </Typography>

        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 15, right: 5, backgroundColor: 'primary.main', 
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? '#3b604a' : '#97b99e',
            }
             }}
        >
          <CloseIcon sx={{ color: 'common.white' }} />
        </IconButton>

        </Box>

        {savedPlants.length === 0 ? (
          <Typography>No saved plants found.</Typography>
        ) : (
          <Box sx={{ mt: 2 }}>
            {savedPlants.map((plant) => (
              <Box
                key={plant.id}
                onClick={() => onSelect(plant)}
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  border: `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <Typography fontWeight="bold">{plant.name}</Typography>
                <Typography variant="body2">
                  Watering: {
                    parseInt(plant.wateringFrequency) === 2 ? 'Frequent' :
                    parseInt(plant.wateringFrequency) === 5 ? 'Average' :
                    parseInt(plant.wateringFrequency) === 10 ? 'Minimum' :
                    'N/A'
                  }
                </Typography>
                <Typography variant="body2">Sunlight: {plant.sunAmount || 'N/A'}</Typography>
                <Typography variant="body2">Indoors: {plant.indoor ? 'Yes' : 'No'}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default SavedPlantsModal;