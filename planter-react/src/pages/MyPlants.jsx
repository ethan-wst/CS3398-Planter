import React, { useState, useEffect } from "react";
import {auth} from "/src/firebaseConfig";
import { useNavigate } from "react-router-dom";  
import { onAuthStateChanged } from "firebase/auth";
import { useTheme } from '@mui/material/styles';
import { Container, Card, CardContent, Typography, Grid2, Button, TextField } from "@mui/material";

const MyPlants = () => {
  const [plant, setPlant] = useState({ name: "", species: "" });
  const [savedPlants, setSavedPlants] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

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

  const loadSavedPlants = (userId) => {
    if (!userId) return;
    const savedPlantsKey = `savedPlants_${userId}`;
    const plants = JSON.parse(localStorage.getItem(savedPlantsKey)) || [];
    setSavedPlants(plants);
  };

  //Function to handle input changes
  const handleChange = (e) => {
    setPlant({ ...plant, [e.target.name]: e.target.value });
  };

  //Function to save a new plant manually
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
      id: Date.now(), //Unique ID
      image: "/PlanterLogoTranspo.png", //Default image
    };

    const updatedPlants = [...savedPlants, newPlant];

    localStorage.setItem(savedPlantsKey, JSON.stringify(updatedPlants));
    setSavedPlants(updatedPlants);
    setPlant({ name: "", species: "" }); //Clear form after adding
  };

  //Function to delete a saved plant
  const deletePlant = (id) => {
    const user = auth.currentUser;
    const userId = user.uid;
    const savedPlantsKey = `savedPlants_${userId}`;
    const updatedPlants = savedPlants.filter((plant) => plant.id !== id);
    localStorage.setItem(savedPlantsKey, JSON.stringify(updatedPlants));
    setSavedPlants(updatedPlants);
  };

  const viewPlantProfile = (id) => {
    navigate(`/plant/${id}`);
  };

  return (
    <Container>
      {/*Form to Manually Add Plants */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <Grid2 container spacing={2}>
          <Grid2 item xs={12} sm={6}>
            <TextField
              label="Plant Name"
              name="name"
              variant="outlined"
              fullWidth
              value={plant.name}
              onChange={handleChange}
              required
            />
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <TextField
              label="Species"
              name="species"
              variant="outlined"
              fullWidth
              value={plant.species}
              onChange={handleChange}
              required
            />
          </Grid2>
        </Grid2>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2, backgroundColor: "#50715c", ":hover": { backgroundColor: "#6b9e83" } }}
        >
          Save Plant
        </Button>
      </form>

      <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", marginBottom: 2 }}>
        🌿 My Saved Plants
      </Typography>
      <Grid2 container spacing={2}>
        {savedPlants.length === 0 ? (
          <Typography sx={{ textAlign: "center", fontStyle: "italic", color: theme.palette.text.secondary, width: "100%" }}>
            No plants saved yet.
          </Typography>
        ) : (
          savedPlants.map((plant) => (
            <Grid2 item key={plant.id} xs={12} sm={6} md={4}>
              <Card sx={{ backgroundColor: theme.palette.background.paper, padding: 2, color: theme.palette.text.primary}}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>{plant.name}</Typography>
                  <Typography color="textSecondary">Species: {plant.species}</Typography>
                  <img src={plant.image || "/public/PlanterLogoTranspo.png"} alt="Plant" width="100" style={{ marginTop: 10 }} />
                  <Button onClick={() => viewPlantProfile(plant.id)} sx={{ color: "blue", marginTop: 1 }}>
                    View Profile
                  </Button>
                  <Button onClick={() => deletePlant(plant.id)} sx={{ color: "grey", marginTop: 1 }}>
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid2>
          ))
        )}
      </Grid2>
    </Container>
  );
};

export default MyPlants;
