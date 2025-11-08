import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

const apiUrl1 = "https://perenual.com/api/v2/species/details/";
const apiUrl2 = "?key=sk-M17K67c79344ea29d8964";

function SearchPlantDetails({ plantId }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading to true
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchPlantDetails = async () => {
      setLoading(true); // Start loading
      setError(null);

      try {
        const response = await fetch(apiUrl1+plantId+apiUrl2); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDetails(data);
      } catch (err) {
        setError(err);
        console.error('Error fetching plant details:', err);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchPlantDetails();
  }, [plantId]);

  if (loading) return <p>Loading plant details...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;
  if (!details) return null; // or <p>Details not available.</p>;

  return (
    <Box 
    sx={{
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      p: 2,
      borderRadius: 2,
      mt: 1
    }}
  >
    <div className="plant-details">
      {details.watering && <p className='watering-detail'>Watering: {details.watering}</p>}
      {details && details.sunlight && (
        <p className='sunlight-detail'>
            Sunlight: {Array.isArray(details.sunlight) ? details.sunlight.join(', ') : details.sunlight}
        </p>
      )}
      {<p className='indoors-detail'>Can be kept indoors: {'' + details.indoor}</p>}
    </div>
    </Box>
  );
}

export default SearchPlantDetails;