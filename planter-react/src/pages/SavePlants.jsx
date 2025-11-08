import React, { useState } from 'react';
import {auth} from "/src/firebaseConfig";

  const SavePlants = ({ plant }) => {
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleSave = () => {
    const user = auth.currentUser;
    const userID = user.uid;
    const savedPlantsKey = `savedPlants_${userID}`;
    const savedPlants = JSON.parse(localStorage.getItem(savedPlantsKey)) || [];

    const newPlant = {
      id: plant.id,
      name: plant.common_name || "Unknown",
      species: plant.scientific_name?.[0] || "Unknown",
      image: plant.default_image?.small_url || "/public/PlanterLogoTranspo.png"
    };

    // Check if the plant is already saved
    const isDuplicate = savedPlants.some(p => p.id === plant.id);
    if (!isDuplicate) {
      savedPlants.push(newPlant);
      localStorage.setItem(savedPlantsKey, JSON.stringify(savedPlants));
      setSaveSuccess(true);
    } else {
      alert("Plant is already saved!");
    }
  };

  return (
    <div>
      <button onClick={handleSave} className="save-button">Save</button>
      {saveSuccess && <p> Plant saved successfully!</p>}
    </div>
  );
};

export default SavePlants;
