import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { format, addMonths, isBefore } from 'date-fns';

const CarouselControls = ({ 
  currentDate, 
  today, 
  handlePrevClick, 
  handleNextClick, 
  arrowButtonStyles,
  viewMode 
}) => {
  const getDateDisplay = () => {
    switch (viewMode) {
      case 'daily':
        return format(currentDate, 'MMMM d, yyyy');
      case 'weekly':
        return `Week of ${format(currentDate, 'MMMM d, yyyy')}`;
      case 'monthly':
        return format(currentDate, 'MMMM yyyy');
      default:
        return format(currentDate, 'MMMM d, yyyy');
    }
  };


  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
      <IconButton
        onClick={handlePrevClick}
        disabled={currentDate <= today}
        sx={arrowButtonStyles}
      >
        <ArrowBackIcon />
      </IconButton>

      <Typography variant="h6" sx={{ mx: 2, flexGrow: 1, textAlign: 'center' }}>
        {getDateDisplay()}
      </Typography>

      <IconButton
        onClick={handleNextClick}
        disabled={!isBefore(currentDate, addMonths(today, 2))}
        sx={arrowButtonStyles}
      >
        <ArrowForwardIcon />
      </IconButton>
    </Box>
  );
};

export default CarouselControls;
