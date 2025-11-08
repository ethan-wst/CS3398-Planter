import React from 'react';
import { 
  Typography, 
  Box, 
  Divider, 
  Stack, 
  Chip, 
  TextField,
  Button,
  IconButton
} from '@mui/material';
import {
  WbSunny as SunIcon,
  Opacity as WaterIcon,
  Home as HomeIcon,
  Yard as YardIcon
} from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toTitleCase } from '/src/utils/plantUtils';
import PlantProgress from '../PlantProgress';

/**
 * Displays care information and log tracking for a plant
 */
const CareInfo = ({
  plant,
  formatSunAmount,
  hasIndoorInfo,
  isIndoorPlant,
  displaySunlightDetails,
  waterAmount,
  onWaterAmountChange,
  onLogWatering,
  onDeleteWatering,
  sunlightHours,
  onSunlightHoursChange,
  onLogSunlight,
  onDeleteSunlight
}) => {
  if (!plant) return null;

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          Care Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip 
            icon={<WaterIcon />}
            label={`Water every ${plant.wateringFrequency || '3'} days`}
            variant="outlined"
            sx={{ mb: 1 }}
          />
          <Chip 
            icon={<SunIcon />}
            label={formatSunAmount(plant.sunAmount)}
            variant="outlined"
            sx={{ mb: 1 }}
          />
          {hasIndoorInfo && (
            <Chip
              icon={isIndoorPlant ? <HomeIcon /> : <YardIcon />}
              label={isIndoorPlant ? "Indoor Plant" : "Outdoor Plant"}
              variant="outlined"
              sx={{ mb: 1 }}
            />
          )}
        </Stack>
        
        {/* Show extended plant details if available */}
        <Stack spacing={1.5} mt={2}>
          {displaySunlightDetails && (
            <Box>
              <Typography variant="caption" color="textSecondary">Sunlight Details</Typography>
              <Typography variant="body1">{displaySunlightDetails}</Typography>
            </Box>
          )}
          
          {plant.plantDetails?.watering && (
            <Box>
              <Typography variant="caption" color="textSecondary">Watering Details</Typography>
              <Typography variant="body1">{plant.plantDetails.watering}</Typography>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Watering Log Section */}
      <Box mb={3}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          Watering Log
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          <TextField
            label="Water amount (mL)"
            type="number"
            value={waterAmount}
            onChange={onWaterAmountChange}
          />
          <Button
            variant="outlined"
            onClick={onLogWatering}
          >
            Log Watering
          </Button>

          {plant.wateringHistory && plant.wateringHistory.length > 0 && (
            <Box>
              <Typography variant="body2" sx={{ fontStyle: "italic", mt: 2, mb: 1 }}>
                Last watered on: {plant.wateringHistory.slice(-1)[0].date}
              </Typography>
              <Stack spacing={1}>
                {plant.wateringHistory.slice().reverse().map((entry, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1,
                      bgcolor: "rgba(0,0,0,0.04)",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">
                      {entry.date} — {entry.amount} mL
                    </Typography>
                    <IconButton
                      onClick={() => onDeleteWatering(i)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Sunlight Log Section */}
      <Box mb={3}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          Sunlight Log
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          <TextField
            label="Sunlight Exposure Time (hrs)"
            type="number"
            value={sunlightHours}
            onChange={onSunlightHoursChange}
          />
          <Button
            variant="outlined"
            onClick={onLogSunlight}
          >
            Log Sunlight Hours
          </Button>

          {plant.sunlightLog && plant.sunlightLog.length > 0 && (
            <Box>
              <Typography variant="body2" sx={{ fontStyle: "italic", mt: 2, mb: 1 }}>
                Last sunlight log: {plant.sunlightLog.slice(-1)[0].date} — {plant.sunlightLog.slice(-1)[0].hours} hrs
              </Typography>
              
              <Stack spacing={1}>
                {plant.sunlightLog.slice().reverse().map((entry, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1,
                      bgcolor: "rgba(0,0,0,0.04)",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">
                      {entry.date} — {entry.hours} hrs
                    </Typography>
                    <IconButton
                      onClick={() => onDeleteSunlight(i)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Plant Progress Charts */}
      {(plant.wateringHistory?.length > 0 || plant.sunlightLog?.length > 0) && (
        <Box mt={3}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Progress Charts
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <PlantProgress plant={plant} />
        </Box>
      )}
    </Box>
  );
};

export default CareInfo;