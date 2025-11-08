import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Divider, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

/**
 * CareTaskCarousel component displays a carousel of plant care tasks.
 * It fetches saved plant profiles from localStorage and displays them in a card format.
 * Users can navigate through the cards using the arrow buttons.
 */
const CareTaskCarousel = () => {
  const [savedPlants, setSavedPlants] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * Fetch saved plant profiles from localStorage on component mount.
   */
  useEffect(() => {
    const plants = JSON.parse(localStorage.getItem("plants")) || [];
    setSavedPlants(plants);
  }, []);

  const maxIndex = Math.max(0, savedPlants.length - 1);
  const plantProfiles = savedPlants.slice(currentIndex, currentIndex + 1);

  /**
   * Handle click event for the previous button.
   * Decrements the current index to show the previous card.
   */
  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  /**
   * Handle click event for the next button.
   * Increments the current index to show the next card.
   */
  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex < maxIndex ? prevIndex + 1 : maxIndex));
  };

  /**
   * Format the given date string to display "Today", "Tomorrow", or the full date.
   * @param {string} dateString - The date string to format.
   * @returns {string} - The formatted date string.
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }
  };
  
  /*
  * Carousel and buttons are functional, but card content is limited so cards cannot be cycled through.
  * Only one card is displayed until task due date are added to profiles
  */
  return (
    <Box className="flex-container" sx={{ display: 'flex', flexDirection: 'column', height: '80vh', mr: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Typography variant="h5">
          Upcoming Care
        </Typography>
        <Box sx={{m:0, p:0, justifyContent: 'right', alignItems: 'right', display: 'flex', }}>
          <IconButton onClick={handlePrevClick} disabled={currentIndex === 0} sx={{ m: .2, p: .5, width: "40px", height: "40px", display: 'flex', justifyContent: 'right', borderRadius: '10%' }}>
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton onClick={handleNextClick} disabled={currentIndex === maxIndex} sx={{ m: .2, p: .5, width: "40px", height: "40px", display: 'flex', justifyContent: 'center', borderRadius: '10%' }}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <Box sx={{ display: 'flex', overflowX: 'hidden' }}>
          {plantProfiles.map((plant, index) => (
            <Card
              key={plant.id}
              sx={{
                width: '97%',
                mt: 2,
                mr: .5,
                flexShrink: 0,
              }}
            > {/* Limited functionality in card content, will be updated as plant profile creation advances */}
              <CardContent>
                <Typography variant="h6">{formatDate(new Date())}</Typography>
                <Box sx={{ marginBottom: 1 }}>
                  <Typography variant="h7">{plant.name} - No tasks assigned</Typography>
                  <Typography variant="body2">Species: {plant.species}</Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CareTaskCarousel;
