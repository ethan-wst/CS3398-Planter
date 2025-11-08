import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  IconButton
} from "@mui/material";
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

// Import the utility functions
import { loadPlantsFromStorage, savePlantsToStorage, formatSunAmount, toTitleCase } from '/src/utils/plantUtils';

// Import our profile components
import BasicInfo from './profile/BasicInfo';
import CareInfo from './profile/CareInfo';
import AdvancedInfo from './profile/AdvancedInfo';

const PlantProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [shareableLink, setShareableLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [waterAmount, setWaterAmount] = useState("");
  const [sunlightHours, setSunlightHours] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Set loading state immediately
    setLoading(true);

    // Use setTimeout to allow React to render the loading state first
    const loadData = setTimeout(() => {
      // Use the same loadPlantsFromStorage utility function that other components use
      const plants = loadPlantsFromStorage();
      const foundPlant = plants.find((p) => String(p.id) === String(id));

      if (foundPlant) {
        console.log("Loaded plant:", foundPlant);
        setPlant(foundPlant);
        setComments(foundPlant.comments || []);
        setShareableLink(`${window.location.origin}/plant/${id}`);
      }
      
      // End loading state after data is processed
      setLoading(false);
    }, 50); // Small delay to ensure loading state renders first

    return () => clearTimeout(loadData);
  }, [id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    alert("Link copied to clipboard!");
  };

  const addComment = () => {
    if (!comment.trim()) return;

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    setComment("");

    // Update the plant's comments in storage
    const plants = loadPlantsFromStorage();
    const updatedPlants = plants.map((p) =>
      String(p.id) === String(id) ? { ...p, comments: updatedComments } : p
    );
    savePlantsToStorage(updatedPlants);
  };

  // Function to determine if plant is indoor
  const hasIndoorInfo = () => {
    return plant?.plantDetails?.indoor !== undefined || plant?.indoor !== undefined;
  };

  // Determine if plant is indoor or outdoor
  const isIndoorPlant = () => {
    if (plant?.plantDetails?.indoor !== undefined) {
      return plant.plantDetails.indoor;
    }
    return plant?.indoor === true;
  };

  // Display sunlight details from plantDetails if available
  const displaySunlightDetails = () => {
    const sunlight = plant?.plantDetails?.sunlight;
    if (!sunlight) return null;
    
    if (Array.isArray(sunlight)) {
      return sunlight.join(', ');
    } else if (typeof sunlight === 'string') {
      return sunlight;
    }
    return null;
  };

  // Handle logging water amount
  const handleLogWatering = () => {
    if (!waterAmount || isNaN(waterAmount)) return;
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toLocaleDateString('en-CA');
    const newEntry = { date: today, amount: parseInt(waterAmount) };
    const updatedHistory = [...(plant.wateringHistory || []), newEntry];
    const updatedPlant = { ...plant, wateringHistory: updatedHistory };
    
    const plants = loadPlantsFromStorage();
    const updatedPlants = plants.map(p =>
      String(p.id) === String(plant.id) ? updatedPlant : p
    );
    
    savePlantsToStorage(updatedPlants);
    setPlant(updatedPlant);
    setWaterAmount("");
  };

  // Handle deleting a watering entry
  const handleDeleteWatering = (index) => {
    const reversedIndex = plant.wateringHistory.length - 1 - index;
    const updatedHistory = plant.wateringHistory.filter((_, idx) => idx !== reversedIndex);
    const updatedPlant = { ...plant, wateringHistory: updatedHistory };
    
    const plants = loadPlantsFromStorage();
    const updatedPlants = plants.map(p =>
      String(p.id) === String(plant.id) ? updatedPlant : p
    );
    
    savePlantsToStorage(updatedPlants);
    setPlant(updatedPlant);
  };

  // Handle logging sunlight hours
  const handleLogSunlight = () => {
    if (!sunlightHours || isNaN(sunlightHours)) return;
    
    const today = new Date().toLocaleDateString('en-CA');
    const newEntry = { date: today, hours: parseInt(sunlightHours) };
    const updatedSunlight = [...(plant.sunlightLog || []), newEntry];
    const updatedPlant = { ...plant, sunlightLog: updatedSunlight };
    
    const plants = loadPlantsFromStorage();
    const updatedPlants = plants.map(p =>
      String(p.id) === String(plant.id) ? updatedPlant : p
    );
    
    savePlantsToStorage(updatedPlants);
    setPlant(updatedPlant);
    setSunlightHours("");
  };

  // Handle deleting a sunlight entry
  const handleDeleteSunlight = (index) => {
    const reversedIndex = plant.sunlightLog.length - 1 - index;
    const updatedLog = plant.sunlightLog.filter((_, idx) => idx !== reversedIndex);
    const updatedPlant = { ...plant, sunlightLog: updatedLog };
    
    const plants = loadPlantsFromStorage();
    const updatedPlants = plants.map(p =>
      String(p.id) === String(plant.id) ? updatedPlant : p
    );
    
    savePlantsToStorage(updatedPlants);
    setPlant(updatedPlant);
  };

  // Loading state - display a spinner while data loads
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
        <CircularProgress size={60} sx={{ color: "#50715c" }} />
      </Container>
    );
  }

  // Error state - only show if not loading AND plant not found
  if (!loading && !plant) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', mt: 2 }}>
          <Button 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/my-plants')}
            sx={{ mb: 1 }}
          >
            Back to My Plants
          </Button>
        </Box>
        <Card sx={{ mt: 4, mb: 4 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" sx={{ color: "error.main", mb: 2 }}>
              Plant Profile Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              The plant you're looking for doesn't seem to exist.
            </Typography>
            <Button 
              variant="contained"
              onClick={() => navigate('/my-plants')}
              sx={{ mt: 3, backgroundColor: "#50715c" }}
            >
              View All Plants
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', mt: 2 }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/my-plants')}
          sx={{ mb: 1 }}
        >
          Back to My Plants
        </Button>
      </Box>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {toTitleCase(plant.name)}
            </Typography>
            <IconButton 
              onClick={() => navigate(`/plant/${id}/edit`)}
              sx={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' }
              }}
            >
              <EditIcon />
            </IconButton>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="fullWidth"
            >
              <Tab label="Basic Info" />
              <Tab label="Care" />
              <Tab label="Advanced Data" />
            </Tabs>
          </Box>

          <Stack spacing={3}>
            {/* Tab content */}
            {activeTab === 0 && (
              <BasicInfo 
                plant={plant}
                shareableLink={shareableLink}
                comments={comments}
                comment={comment}
                onCommentChange={(e) => setComment(e.target.value)}
                onAddComment={addComment}
                onCopyLink={copyToClipboard}
              />
            )}

            {activeTab === 1 && (
              <CareInfo 
                plant={plant}
                formatSunAmount={formatSunAmount}
                hasIndoorInfo={hasIndoorInfo()}
                isIndoorPlant={isIndoorPlant()}
                displaySunlightDetails={displaySunlightDetails()}
                waterAmount={waterAmount}
                onWaterAmountChange={(e) => setWaterAmount(e.target.value)}
                onLogWatering={handleLogWatering}
                onDeleteWatering={handleDeleteWatering}
                sunlightHours={sunlightHours}
                onSunlightHoursChange={(e) => setSunlightHours(e.target.value)}
                onLogSunlight={handleLogSunlight}
                onDeleteSunlight={handleDeleteSunlight}
              />
            )}

            {activeTab === 2 && (
              <AdvancedInfo plant={plant} />
            )}
          </Stack>
          
        </CardContent>
      </Card>
    </Container>
  );
};

export default PlantProfile;
