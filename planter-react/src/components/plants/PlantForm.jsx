import React from 'react';
import {
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";

const PlantForm = ({ plant, onChange, onSubmit, submitButtonText = "Save Plant" }) => {
  return (
    <form onSubmit={onSubmit} style={{ marginBottom: "20px" }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Plant Name"
            name="name"
            variant="outlined"
            fullWidth
            value={plant.name}
            onChange={onChange}
            required
          />
          <TextField
            label="Species"
            name="species"
            variant="outlined"
            fullWidth
            value={plant.species}
            onChange={onChange}
            required
          />
        </Stack>
        
        <TextField
          label="Description"
          name="description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={plant.description || ''}
          onChange={onChange}
        />
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Sunlight Needs</InputLabel>
            <Select
              name="sunAmount"
              value={plant.sunAmount || "full_sun"}
              onChange={onChange}
              label="Sunlight Needs"
            >
              <MenuItem value="full_sun">Full Sun (6+ hrs)</MenuItem>
              <MenuItem value="part_sun">Part Sun (4-6 hrs)</MenuItem>
              <MenuItem value="part_shade">Part Shade (2-4 hrs)</MenuItem>
              <MenuItem value="full_shade">Full Shade (0-2 hrs)</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Watering Frequency (days)"
            name="wateringFrequency"
            type="number"
            variant="outlined"
            fullWidth
            value={plant.wateringFrequency || '3'}
            onChange={onChange}
          />
        </Stack>
      </Stack>
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2, backgroundColor: "#50715c", "&:hover": { backgroundColor: "#6b9e83" } }}
      >
        {submitButtonText}
      </Button>
    </form>
  );
};

export default PlantForm;