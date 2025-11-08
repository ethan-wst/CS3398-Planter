import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { auth } from '/src/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { loadPlantsFromStorage, savePlantsToStorage, isPlantSaved } from '/src/utils/plantUtils';
import { getUserPreference } from '/src/utils/preferencesUtils';
import { createCareTask } from '/src/utils/careTaskUtils';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';

const SavePlants = ({ plant, details }) => {
  const [user] = useAuthState(auth);
  const [saved, setSaved] = useState(false);
  const [storeAdvancedData, setStoreAdvancedData] = useState(false);
  const navigate = useNavigate();

  // Check if this plant is already saved and load user preferences
  useEffect(() => {
    if (user) {
      setSaved(isPlantSaved(plant.id));
      setStoreAdvancedData(getUserPreference('storeAdvancedData', false));
    }
  }, [plant.id, user]);

  // Listen for preference changes
  useEffect(() => {
    const handlePrefsUpdate = (e) => {
      if (e.detail.key === 'storeAdvancedData') {
        setStoreAdvancedData(e.detail.value);
      }
    };
    
    window.addEventListener('userPreferencesUpdated', handlePrefsUpdate);
    return () => window.removeEventListener('userPreferencesUpdated', handlePrefsUpdate);
  }, []);

  // Helper function to convert API watering value to a frequency in days
  const getWateringFrequency = (wateringValue = "average") => {
    const wateringMap = {
      "frequent": "2", 
      "average": "5",
      "minimum": "10",
      "none": "14"
    };
    return wateringMap[String(wateringValue).toLowerCase()] || "7";
  };

  // Helper function to convert API sunlight value to our format
  const getSunlightPreference = (sunlightValue = []) => {
    // Make sure we have an array to work with
    const sunlightArray = Array.isArray(sunlightValue) ? sunlightValue : [sunlightValue].filter(Boolean);
    
    // Join array to string and convert to lowercase for easier matching
    const sunlightString = sunlightArray.join(' ').toLowerCase();
    
    if (sunlightString.includes('full sun') || sunlightString.includes('full_sun')) return 'full_sun';
    if (sunlightString.includes('part sun') || sunlightString.includes('part_sun') || 
        sunlightString.includes('sun-part') || sunlightString.includes('filtered')) return 'part_sun';
    if (sunlightString.includes('part shade') || sunlightString.includes('part_shade') || 
        sunlightString.includes('partial shade')) return 'part_shade';
    if (sunlightString.includes('full shade') || sunlightString.includes('full_shade') || 
        sunlightString.includes('no sun') || sunlightString.includes('deep shade')) return 'full_shade';
    
    return 'full_sun'; // Default
  };

  const handleSave = () => {
    if (!user) {
      alert("You must be logged in to save plants.");
      navigate('/auth');
      return;
    }

    if (saved) {
      alert("This plant is already saved to your collection!");
      return;
    }
    
    // Prepare plant data
    const sunlightInfo = Array.isArray(plant.sunlight) ? plant.sunlight : 
                         (plant.sunlight ? [plant.sunlight] : []);
    
    // Create base plant object with data from the main plant object
    const formattedPlant = {
      id: plant.id,
      name: plant.common_name || "Unknown Plant",
      species: plant.scientific_name?.[0] || "Unknown Species",
      cycle: plant.cycle || "Unknown Cycle",
      description: details?.description || "No description available",
      image: plant.default_image?.small_url || "/PlanterLogoTranspo.png",
      wateringFrequency: getWateringFrequency(plant.watering),
      sunAmount: getSunlightPreference(sunlightInfo),
      indoor: plant.indoor || false,
      saveDate: new Date().toISOString(),
      careTasks: [], // Initialize empty care tasks array
    };

    // Add advanced data if enabled in user preferences
    if (storeAdvancedData && details) {
      formattedPlant.advancedData = {
        maintenance: details.maintenance,
        dimensions: details.dimensions,
        growth_rate: details.growth_rate,
        hardiness: {
          min: details.hardiness?.min,
          max: details.hardiness?.max,
          zones: details.hardiness_location
        },
        pruning_month: details.pruning_month,
        pruning_count: details.pruning_count,
        soil: details.soil,
        propagation: details.propagation,
        flowers: details.flowers,
        edible: details.edible,
        tropical: details.tropical,
        care_level: details.care_level,
        pest_susceptibility: details.pest_susceptibility,
        pest_deterrent: details.pest_deterrent,
        poisonous_to_humans: details.poisonous_to_humans,
        poisonous_to_pets: details.poisonous_to_pets,
        drought_tolerant: details.drought_tolerant,
        salt_tolerant: details.salt_tolerant,
        thorny: details.thorny,
        invasive: details.invasive,
        rare: details.rare,
        medicinal: details.medicinal,
        origin: details.origin,
        synonyms: details.synonyms,
        attracts: details.attracts,
      };
    }

    console.log("Formatted Plant:", formattedPlant);

    // Save to storage
    const existingPlants = loadPlantsFromStorage();
    savePlantsToStorage([...existingPlants, formattedPlant]);
    setSaved(true);
    
    // Add watering task
    const waterTaskData = {
      name: "Water",
      frequency: formattedPlant.wateringFrequency,
    };
    createCareTask(plant.id, waterTaskData);
  };

  return (
    <Button
      variant="contained"
      color={saved ? "success" : "primary"}
      onClick={handleSave}
      startIcon={saved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      sx={{ 
        mt: 2, 
        backgroundColor: saved ? "#4caf50" : "#50715c",
        "&:hover": { backgroundColor: saved ? "#45a049" : "#6b9e83" }
      }}
    />
  );
};

export default SavePlants;
