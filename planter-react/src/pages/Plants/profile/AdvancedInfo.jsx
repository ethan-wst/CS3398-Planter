import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  Divider, 
  Stack, 
  Chip,
  Alert,
  Card,
  CardMedia,
  Button,
  Link
} from '@mui/material';
import { safeRender } from './RenderUtils';
import { toTitleCase, getHardinessZoneInfo, checkPlantHardinessSuitability } from '/src/utils/plantUtils';

/**
 * Displays advanced technical data about a plant
 */
const AdvancedInfo = ({ plant }) => {
  const [zoneInfo, setZoneInfo] = useState(null);
  const [suitability, setSuitability] = useState(null);
  
  useEffect(() => {
    // Get hardiness zone information based on user's state setting
    if (plant && plant.advancedData && plant.advancedData.hardiness) {
      setZoneInfo(getHardinessZoneInfo());
      setSuitability(checkPlantHardinessSuitability(plant));
    }
  }, [plant]);

  if (!plant || !plant.advancedData) {
    return (
      <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
        Advanced data is not available for this plant. Enable "Store advanced plant data" in Settings to see more detailed information for future plants you add.
      </Typography>
    );
  }

  return (
    <Box>
        {/* Growth Information */}
      {plant.advancedData.growth_rate && (
        <Box mb={3}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Growth Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1.5}>
            <Box>
              <Typography variant="caption" color="textSecondary">Growth Rate</Typography>
              <Typography variant="body1">{toTitleCase(safeRender(plant.advancedData.growth_rate))}</Typography>
            </Box>
          </Stack>
        </Box>
      )}
      
      {/* Hardiness Information */}
      {plant.advancedData.hardiness && (
        <Box mb={3}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Hardiness Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1.5}>
            {plant.advancedData.hardiness.min == plant.advancedData.hardiness.max&& (
              <Box>
                <Typography variant="caption" color="textSecondary">Recommended Zone</Typography>
                <Typography variant="body1">{safeRender(plant.advancedData.hardiness.min)}</Typography>              
              </Box>
            )}
            {plant.advancedData.hardiness.min != plant.advancedData.hardiness.max&& (
              <Box>
                <Typography variant="caption" color="textSecondary">Recommended Zones</Typography>
                <Typography variant="body1">{`${safeRender(plant.advancedData.hardiness.min)} - ${safeRender(plant.advancedData.hardiness.max)}`}</Typography>              
              </Box>
            )}
            
            {/* Zone suitability information */}
            {suitability && (
              <Box mt={1}>
                {suitability.suitable === true && (
                  <Alert severity="success" sx={{ mt: 1 }}>
                    {suitability.message}
                  </Alert>
                )}
                {suitability.suitable === false && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    {suitability.message}
                  </Alert>
                )}
                {suitability.suitable === null && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    {suitability.message}
                  </Alert>
                )}
              </Box>
            )}
            
            {/* Default national map if no state selected */}
            {(!zoneInfo || zoneInfo.defaultView) && (
              <Box mt={2}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Set your location in Settings to see your state's hardiness zone map and get plant suitability information.
                </Alert>
                <Link href="/settings" underline="none">
                  <Button variant="outlined" size="small">
                    Go to Settings
                  </Button>
                </Link>
              </Box>
            )}
          </Stack>
        </Box>
      )}

      {/* Safety Information - Always displayed, even if plant is not poisonous */}
      <Box mb={3}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500}}>
          Safety Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={1.5}>
          <Box>
            <Typography variant="caption" color="textSecondary">Poisonous to humans</Typography>
            <Typography 
              variant="body1" 
            >
              {plant.advancedData.poisonous_to_humans ? "Yes" : "No"}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">Poisonous to pets</Typography>
            <Typography 
              variant="body1" 
            >
              {plant.advancedData.poisonous_to_pets ? "Yes" : "No"}
            </Typography>
          </Box>
        </Stack>
      </Box>
      
      
      
      {/* Care & Maintenance */}
      <Box mb={3}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          Care & Maintenance
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={1.5}>
          {plant.advancedData.maintenance && (
            <Box>
              <Typography variant="caption" color="textSecondary">Maintenance Level</Typography>
              <Typography variant="body1">{toTitleCase(safeRender(plant.advancedData.maintenance))}</Typography>
            </Box>
          )}
          {plant.advancedData.soil.length > 0 && (
            <Box>
              <Typography variant="caption" color="textSecondary">Soil Preferences</Typography>
              <Typography variant="body1">{safeRender(plant.advancedData.soil)}</Typography>
            </Box>
          )}
          {plant.advancedData.propagation.length > 0 && (
            <Box>
              <Typography variant="caption" color="textSecondary">Propagation Methods</Typography>
              <Typography variant="body1">{safeRender(plant.advancedData.propagation)}</Typography>
            </Box>
          )}
        </Stack>
      </Box>
      
      {/* Pruning Information */}
      {(plant.advancedData.pruning_month && plant.advancedData.pruning_count > 0) && (
        <Box mb={3}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Pruning Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1.5}>
            {plant.advancedData.pruning_month && (
              <Box>
                <Typography variant="caption" color="textSecondary">Pruning Month</Typography>
                <Typography variant="body1">{toTitleCase(safeRender(plant.advancedData.pruning_month))}</Typography>
              </Box>
            )}
            {plant.advancedData.pruning_count && (
              <Box>
                <Typography variant="caption" color="textSecondary">Pruning Frequency</Typography>
                <Typography variant="body1">{safeRender(plant.advancedData.pruning_count)}</Typography>
              </Box>
            )}
          </Stack>
        </Box>
      )}
      
      {/* Key Characteristics */}
      {( plant.advancedData.drought_tolerant || plant.advancedData.edible || plant.advancedData.medicinal || plant.advancedData.invasive || plant.advancedData.thorny || plant.advancedData.flowers || plant.advancedData.tropical) && (
        <Box mb={3}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Key Characteristics
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
            {plant.advancedData.drought_tolerant && (
                <Chip label="Drought Tolerant" size="small" variant="outlined" />
            )}
            {plant.advancedData.edible && (
                <Chip label="Edible" size="small" variant="outlined" />
            )}
            {plant.advancedData.medicinal && (
                <Chip label="Medicinal" size="small" variant="outlined" />
            )}
            {plant.advancedData.invasive && (
                <Chip label="Invasive" size="small" variant="outlined" />
            )}
            {plant.advancedData.thorny && (
                <Chip label="Thorny" size="small" variant="outlined" />
            )}
            {plant.advancedData.flowers && (
                <Chip label="Flowering" size="small" variant="outlined" />
            )}
            {plant.advancedData.tropical && (
                <Chip label="Tropical" size="small" variant="outlined" />
            )}
            </Stack>
        </Box>
      )}
      
      
    </Box>
  );
};

export default AdvancedInfo;