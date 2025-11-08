import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CardMedia,
  CardActions,
  Collapse,
  IconButton,
  Chip,
  Tooltip,
  Stack,
  Snackbar,
  Alert
} from "@mui/material";

import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Opacity as WaterIcon,
  Home as HomeIcon,
  Yard as YardIcon,
  Add as AddIcon
} from '@mui/icons-material';

// Import the sun icons
import {
  WbSunny as FullSunIcon, 
  WbTwilight as PartSunIcon,
  Cloud as PartShadeIcon,
  NightsStay as FullShadeIcon
} from '@mui/icons-material';

import TaskForm from './TaskForm';

const PlantCard = ({ plant, onDelete, onEdit, onToggleFavorite }) => {
  const [expanded, setExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(plant.isFavorite || false);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  
  // Function to convert sun_amount values to readable text
  const formatSunAmount = (sunAmount) => {
    const sunOptions = {
      full_sun: "Full Sun (6+ hrs)",
      part_sun: "Part Sun (4-6 hrs)",
      part_shade: "Part Shade (2-4 hrs)",
      full_shade: "Full Shade (0-2 hrs)"
    };
    return sunOptions[sunAmount] || "Full Sun (6+ hrs)";
  };

  // Get appropriate sun icon based on sun amount
  const getSunIcon = () => {
    switch(plant.sunAmount) {
      case 'full_sun':
        return <FullSunIcon sx={{ color: '#FFA500' }} />;
      case 'part_sun':
        return <PartSunIcon sx={{ color: '#FFB347' }} />;
      case 'part_shade':
        return <PartShadeIcon sx={{ color: '#B0C4DE' }} />;
      case 'full_shade':
        return <FullShadeIcon sx={{ color: '#6B8E23' }} />;
      default:
        return <FullSunIcon sx={{ color: '#FFA500' }} />;
    }
  };
  
  // Check if plant has indoor status info
  const hasIndoorInfo = () => {
    return plant.plantDetails?.indoor !== undefined || plant.indoor !== undefined;
  };

  // Determine if plant is indoor or outdoor
  const isIndoorPlant = () => {
    if (plant.plantDetails?.indoor !== undefined) {
      return plant.plantDetails.indoor;
    }
    return plant.indoor === true;
  };
  
  // Function to convert text to title case (capitalize first letter of each word)
  const toTitleCase = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Convert original sunlight data to a formatted string for display in expanded info
  const displaySunlightDetails = () => {
    const sunlight = plant.plantDetails?.sunlight;
    if (!sunlight) return null;
    
    if (Array.isArray(sunlight)) {
      return sunlight.join(', ');
    } else if (typeof sunlight === 'string') {
      return sunlight;
    }
    return null;
  };

  // Display original watering info from API
  const displayWateringDetails = () => {
    return plant.plantDetails?.watering || '';
  };

  // Handle closing the task dialog and processing the result
  const handleCloseTaskDialog = (message) => {
    setOpenTaskDialog(false);
    if (message) {
      setSuccessMessage(message);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',  // Take full height of container
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '350px',
        width: '100%',
        margin: '0 auto',
        borderRadius: 2,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[4],
        },
      }}
    >
      <CardMedia
        component="img"
        height={180}  // Fixed height for consistent card images
        sx={{ 
          objectFit: 'cover',
          bgcolor: '#f7f7f7',
        }}
        image={plant.image || "/PlanterLogoTranspo.png"}
        alt={plant.name}
      />
      
      <CardContent sx={{ 
        flexGrow: 1,   // Allow content to grow and fill space
        pb: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Distribute content evenly
      }}>
        <Box sx={{ height: '80px', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }} >
            {toTitleCase(plant.name)}
          </Typography>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              height: '1.5em',  // Fixed height for species name
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {plant.species}
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          flexWrap: 'wrap', 
          mb: 1,
          mt: 'auto' // Push chips to bottom of content area
        }}>
          <Chip
            icon={<WaterIcon />}
            label={`Water every ${plant.wateringFrequency || '3'} days`}
            size="small"
            variant="outlined"
            sx={{
              mb: 0.5,
              pl: 0.3
            }}
          />
          <Chip
            icon={getSunIcon()}
            label={formatSunAmount(plant.sunAmount)}
            size="small"
            variant="outlined"
            sx={{ 
              mb: 0.5,
              pl: 0.3
             }}
          />
          {hasIndoorInfo() && (
            <Tooltip title={isIndoorPlant() ? "Can be kept indoors" : "Outdoor plant"}>
              <Chip
                icon={isIndoorPlant() ? <HomeIcon /> : <YardIcon />}
                label={isIndoorPlant() ? "Indoor" : "Outdoor"}
                size="small"
                variant="outlined"
                sx={{ 
                  mb: 0.5,
                  pl: 0.3  
                }}
              />
            </Tooltip>
          )}
        </Box>
      </CardContent>

      <CardActions disableSpacing sx={{ mt: 'auto' }}>  {/* Push actions to bottom */}
        <IconButton
          onClick={() => {
            setIsFavorite(!isFavorite);
            onToggleFavorite?.(plant.id);
          }}
        >
          {isFavorite ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
        
        <IconButton onClick={() => onEdit?.(plant.id)}>
          <EditIcon />
        </IconButton>

        <IconButton 
          onClick={() => onDelete?.(plant.id)}
          sx={{ '&:hover': { color: 'error.main' } }}
        >
          <DeleteIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />
        
        <IconButton
          onClick={() => setExpanded(!expanded)}
          sx={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Plant Details:</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>  {/* Changed from paragraph to body2 with margin */}
            {plant.description ? plant.description.split('.')[0] + '.' : 'No additional details available.'}
          </Typography>
          
          {plant.plantDetails && (
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Care Information:
              </Typography>
              
              {displayWateringDetails() && (
                <Typography variant="body2">
                  <strong>Watering:</strong> {displayWateringDetails()}
                </Typography>
              )}
              
              {displaySunlightDetails() && (
                <Typography variant="body2">
                  <strong>Sunlight:</strong> {displaySunlightDetails()}
                </Typography>
              )}
              
              {hasIndoorInfo() && (
                <Typography variant="body2">
                  <strong>Indoor Plant:</strong> {isIndoorPlant() ? 'Yes' : 'No'}
                </Typography>
              )}
            </Stack>
          )}
          
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate(`/plant/${plant.id}`)}
            sx={{ mb: 2 }}
          >
            View Full Profile
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            startIcon={<AddIcon />}
            onClick={() => setOpenTaskDialog(true)}
            sx={{ 
              backgroundColor: "#50715c",
              color: "white",
              "&:hover": { backgroundColor: "#6b9e83" }
            }}
          >
            Create New Task
          </Button>
          
          {/* Task Form Dialog */}
          <TaskForm 
            plantId={plant.id}
            open={openTaskDialog}
            onClose={handleCloseTaskDialog}
          />
          
          {/* Success Message Snackbar */}
          <Snackbar
            open={!!successMessage}
            autoHideDuration={4000}
            onClose={() => setSuccessMessage("")}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert severity="success" onClose={() => setSuccessMessage("")}>
              {successMessage}
            </Alert>
          </Snackbar>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default PlantCard;