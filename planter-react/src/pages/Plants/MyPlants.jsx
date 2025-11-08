import React, { useState, useEffect } from "react";
import {auth} from "/src/firebaseConfig";
import { useNavigate } from "react-router-dom";  
import { onAuthStateChanged } from "firebase/auth";
import { 
  Container, Typography, Stack, TextField, InputAdornment, 
  IconButton, Box, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Paper, OutlinedInput, FormControl, InputLabel
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

// Import custom components and utilities
import PlantCard from '/src/components/plants/PlantCard';
import PlantForm from '/src/components/plants/PlantForm';
import { loadPlantsFromStorage, savePlantsToStorage } from '/src/utils/plantUtils';

const MyPlants = () => {
  const [plant, setPlant] = useState({ 
    name: "", 
    species: "",
    description: "",
    sunAmount: "full_sun",
    wateringFrequency: "3"
  });
  const [savedPlants, setSavedPlants] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        loadSavedPlants(user.uid);
      } else {
        setSavedPlants([]); 
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  //Function to handle input changes
  useEffect(() => {
    loadSavedPlants();
    
    const handleStorageUpdate = () => loadSavedPlants();
    window.addEventListener("storage", handleStorageUpdate);
    
    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  const loadSavedPlants = () => {
    setSavedPlants(loadPlantsFromStorage());
  };

  const handleChange = (e) => {
    setPlant({ ...plant, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!plant.name.trim() || !plant.species.trim()) {
      alert("Please enter both plant name and species.");
      return;
    }

    if (!user) {
      alert("You must be logged in to save plants.");
      return;
    }

    const userId = user.uid;
    const savedPlantsKey = `savedPlants_${userId}`;
    const savedPlants = JSON.parse(localStorage.getItem(savedPlantsKey)) || [];

    const newPlant = {
      ...plant,
      id: Date.now(),
      image: "/PlanterLogoTranspo.png",
    };

    const updatedPlants = [...savedPlants, newPlant];
    
    savePlantsToStorage(updatedPlants);
    setSavedPlants(updatedPlants);
    setPlant({ 
      name: "", 
      species: "",
      description: "",
      sunAmount: "full_sun",
      wateringFrequency: "3"
    });
    
    setOpenAddDialog(false); // Close dialog after submission
  };

  const deletePlant = (id) => {
    const user = auth.currentUser;
    const userId = user.uid;
    const savedPlantsKey = `savedPlants_${userId}`;
    const updatedPlants = savedPlants.filter((plant) => plant.id !== id);
    savePlantsToStorage(updatedPlants);
    setSavedPlants(updatedPlants);
  };

  const toggleFavorite = (id) => {
    const updatedPlants = savedPlants.map(p => 
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    );
    savePlantsToStorage(updatedPlants);
    setSavedPlants(updatedPlants);
  };

  // Filter plants based on search term
  const filteredPlants = savedPlants.filter(plant => 
    plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plant.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plant.description && plant.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container>
      <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", marginBottom: 2 }}>
        🌿 My Plants
      </Typography>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 1, 
          mb: 3, 
          mt: 2, 
          display: 'flex', 
          alignItems: 'center',
          borderRadius: '12px',
        }}
      >
        <FormControl fullWidth sx={{ mr: 1 }}>
          <OutlinedInput
            placeholder="Search plants by name, species or description..."
            value={searchTerm}
            onChange={handleSearchChange}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            }
            sx={{ borderRadius: '8px' }}
          />
        </FormControl>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
          sx={{ 
            backgroundColor: "#50715c", 
            "&:hover": { backgroundColor: "#6b9e83" },
            height: '56px',
            borderRadius: '8px',
            lineHeight: '1.4',
            
            }}
        >
          Add Plant
        </Button>
      </Paper>

      {/* Add Plant Dialog */}
      <Dialog 
        open={openAddDialog} 
        onClose={() => setOpenAddDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: '12px' }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Plant</DialogTitle>
        <DialogContent>
          <PlantForm 
            plant={plant}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitButtonText="Add Plant"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>


      
      <Stack 
        direction="row" 
        spacing={2} 
        useFlexGap 
        flexWrap="wrap"
        sx={{ 
          '& > *': { 
            flexBasis: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 16px)' }
          }
        }}
      >
        {filteredPlants.length === 0 ? (
          <Typography sx={{ textAlign: "center", fontStyle: "italic", color: "gray", width: "100%" }}>
            {searchTerm ? "No plants match your search." : "No plants saved yet."}
          </Typography>
        ) : (
          filteredPlants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onDelete={deletePlant}
              onEdit={(id) => navigate(`/plant/${id}/edit`)}
              onToggleFavorite={toggleFavorite}
            />
          ))
        )}
      </Stack>
    </Container>
  );
};

export default MyPlants;
