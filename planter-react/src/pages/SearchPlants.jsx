import React, { useState, useRef, useEffect } from 'react';
import '/src/theme/pages/search-styling.css';
import SavePlants from "/src/components/plants/SavePlants";
import SearchPlantDetails from '/src/pages/Plants/SearchPlantDetails';
import { TextField, Button } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { Paper } from '@mui/material';
import SavedPlantsModal from '/src/pages/Plants/SavedPlantsModal'; // Import the new modal component

const mainApiUrl = 'https://perenual.com/api/species-list?key=sk-M17K67c79344ea29d8964&q=';

var numSearchPages;
var currentPage;
var currentName, currentWatering, currentSunlight, currentIndoorsness;

function SearchPlants() {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [paginationButtonClicked, setPaginationClick] = useState(false);
  const [firstSearch, setFirstSearch] = useState(true);
  const [plantList, setPlantList] = useState([]);
  const [plantDetails, setPlantDetails] = useState({});
  const textAreaRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const paginationAreaRef = useRef(null);
  const dropdownWatering = useRef(null);
  const dropdownSunlight = useRef(null);
  const dropdownIndoors = useRef(null);
  const theme = useTheme();
  const [showSavedPlantsModal, setShowSavedPlantsModal] = useState(false); // State for modal visibility
  const [selectedSavedPlant, setSelectedSavedPlant] = useState(null); // State for selected saved plant

  const handleClick = () => {
    setButtonClicked(true);
  };

  const handlePagination = () => {
    setPaginationClick(true);
  };

  const fetchPlantDetails = async (plantId) => {
    try {
      const response = await fetch(`https://perenual.com/api/v2/species/details/${plantId}?key=sk-M17K67c79344ea29d8964`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Store details in state with plant ID as key
      setPlantDetails(prev => ({
        ...prev,
        [plantId]: data
      }));

      return data;
    } catch (err) {
      console.error(`Error fetching details for plant ${plantId}:`, err);
      return null;
    }
  };

  //Effect that happens when user clicks the primary search button
  useEffect(() => {
    if (buttonClicked && textAreaRef.current) {
      setButtonClicked(false);
      setLoading(true);
      setFirstSearch(false);

      let plantInput = textAreaRef.current.value;
      currentName = textAreaRef.current.value;
      let wateringInput = dropdownWatering.current.value;
      currentWatering = dropdownWatering.current.value;
      let sunlightInput = dropdownSunlight.current.value;
      currentSunlight = dropdownSunlight.current.value;
      let indoorsInput = dropdownIndoors.current.value;
      currentIndoorsness = dropdownIndoors.current.value;
      currentPage = 1;

      wateringInput = wateringInput !== "null" ? `&watering=${wateringInput}` : "";
      sunlightInput = sunlightInput !== "null" ? `&sunlight=${sunlightInput}` : "";
      indoorsInput = indoorsInput !== "null" ? `&indoor=${indoorsInput}` : "";
      let currentPageInput = currentPage !== "null" ? `&page=${currentPage}` : "";

      fetch(mainApiUrl + plantInput + wateringInput + sunlightInput + indoorsInput + currentPageInput)
        .then(response => response.json())
        .then(apiResponse1 => {
          //console.log("Num pages: ", apiResponse1.last_page);

          if (apiResponse1.last_page > 0) {
            numSearchPages = apiResponse1.last_page;
          }

          if (!apiResponse1.data || apiResponse1.data.length === 0) {
            setPlantList([]);
          } else {
            setPlantList(apiResponse1.data);

            apiResponse1.data.forEach(plant => {
              fetchPlantDetails(plant.id);
            });
          }

          setLoading(false);
        })
        .catch(error => {
          console.error("🚨 Error fetching plant data:", error);
          setPlantList([]);
          setLoading(false);
        })
    }
  }, [buttonClicked]);

  //Effect that happens when the user clicks the pagination button
  useEffect(() => {
    if (paginationButtonClicked && paginationAreaRef.current) {
      setPaginationClick(false);
      setLoading(true);
      setFirstSearch(false);
      console.log("Pagination button clicked");

      let plantInput = currentName;
      let wateringInput = currentWatering;
      let sunlightInput = currentSunlight;
      let indoorsInput = currentIndoorsness;

      //If user's input for page is greater than # of search pages, set current page = the number of # pages
      if (paginationAreaRef.current.value > numSearchPages) {
        currentPage = numSearchPages;
      } else {
        currentPage = paginationAreaRef.current.value;
      }

      //The code below is basically a copy of the code used for the regular search button
      wateringInput = wateringInput !== "null" ? `&watering=${wateringInput}` : "";
      sunlightInput = sunlightInput !== "null" ? `&sunlight=${sunlightInput}` : "";
      indoorsInput = indoorsInput !== "null" ? `&indoor=${indoorsInput}` : "";
      let currentPageInput = currentPage !== "null" ? `&page=${currentPage}` : "";

      fetch(mainApiUrl + plantInput + wateringInput + sunlightInput + indoorsInput + currentPageInput)
        .then(response => response.json())
        .then(apiResponse1 => {
          //console.log("API Response:", apiResponse1);
          //console.log("Num pages: ", apiResponse1.last_page);

          if (apiResponse1.last_page > 0) {
            numSearchPages = apiResponse1.last_page;
          }

          if (!apiResponse1.data || apiResponse1.data.length === 0) {
            setPlantList([]);
          } else {
            setPlantList(apiResponse1.data);
          }

          setLoading(false);
        })
        .catch(error => {
          console.error("🚨 Error fetching plant data:", error);
          setPlantList([]);
          setLoading(false);
        })
    }
  }, [paginationButtonClicked]);

  //Effect that occurs when first loading the page
  useEffect(() => {
    setFirstSearch(true);
    setPlantList([]);
    numSearchPages = 1;
  }, []);

  const handleUseSavedPlants = () => {
    setShowSavedPlantsModal(true);
  };

  const handleSelectSavedPlant = (plant) => {
    setSelectedSavedPlant(plant);

    // Set search parameters based on the selected saved plant
    //textAreaRef.current.value = selectedSavedPlant.name;
    dropdownWatering.current.value = selectedSavedPlant.wateringFrequency === "2" ? "frequent" :
                                selectedSavedPlant.wateringFrequency === "5" ? "average" :
                                selectedSavedPlant.wateringFrequency === "10" ? "minimum" :
                                "null";
    dropdownSunlight.current.value = selectedSavedPlant.sunAmount === "part_sun" ? "sun-part_shade" : selectedSavedPlant.sunAmount || "null";
    dropdownIndoors.current.value = selectedSavedPlant.indoor ? "1" : "0" || "null";

    // Trigger the search
    setButtonClicked(true);
    setShowSavedPlantsModal(false);
  };

  return (
    <div className="main-container">
      <div className="header-bar"></div>
      <div className="content">
        <div className="search-bar">
          <TextField
            variant="outlined"
            placeholder="Look for a plant..."
            inputRef={textAreaRef}
            size="small"
            sx={{
              flex: 1,
              input: { color: 'text.primary' },
              bgcolor: 'background.paper',
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'divider' },
                '&:hover fieldset': { borderColor: 'primary.main' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' }
              }
            }}
          />

          <Button
            variant="contained"
            onClick={handleClick}
            sx={{
              backgroundColor: 'primary.main',
              color: 'common.white',
              '&:hover': { backgroundColor: 'primary.dark' }
            }}
          >
            Send It
          </Button>

        </div>
        <div className="options-holder">
          <div className="individual-option">
            <h3>Watering</h3>
            <select name="search-option-1"
              ref={dropdownWatering}
              style={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                border: '1px solid #444',
                borderRadius: '5px',
                padding: '6px 10px',
                width: '180px',
                fontSize: '14px'
              }}
            >
              <option value="null">No selection</option>
              <option value="frequent">Frequent</option>
              <option value="average">Average</option>
              <option value="minimum">Minimal</option>
            </select>
          </div>

          <div className="individual-option">
            <h3>Sunlight</h3>
            <select name="search-option-2"
              ref={dropdownSunlight}
              style={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                border: '1px solid #444',
                borderRadius: '5px',
                padding: '6px 10px',
                width: '180px',
                fontSize: '14px'
              }}
            >
              <option value="null">No selection</option>
              <option value="full_shade">Full Shade</option>
              <option value="part_shade">Part Shade</option>
              <option value="sun-part_shade">Part Sun</option>
              <option value="full_sun">Full Sun</option>
            </select>
          </div>

          <div className="individual-option">
            <h3>Indoors-ness</h3>
            <select name="search-option-3"
              ref={dropdownIndoors}
              style={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                border: '1px solid #444',
                borderRadius: '5px',
                padding: '6px 10px',
                width: '180px',
                fontSize: '14px'
              }}
            >
              <option value="null">No selection</option>
              <option value="1">Kept Indoors</option>
              <option value="0">Kept Outdoors</option>
            </select>
          </div>
        </div>

        <button onClick={handleUseSavedPlants} style={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                border: '1px solid #444',
                borderRadius: '5px',
                padding: '6px 10px',
                width: '180px',
                fontSize: '14px'
              }}>Use parameters from saved plants</button>

        <hr />

        {/*Display search results & add a Save button */}
        <div id="search-results">
          {firstSearch === false ? (
            <div>
              {loading === true ? (
                <div><p>Loading...</p></div>
              ) : (
                <div>
                  {plantList.length === 0 ? (
                    <div>
                      <p>No results found for the following parameters: </p>
                      <ul>
                        <li>Name: {currentName}</li>
                        <li> Watering: {currentWatering}</li>
                        <li>Sunlight: {currentSunlight}</li>
                        <li>Indoorsness: {currentIndoorsness}</li>
                      </ul>
                      <p>Please try a different search!</p>
                    </div>

                  ) : (
                    plantList.map((plant) => (
                      <Paper key={plant.id} elevation={3} sx={{ padding: 2, marginBottom: 2, backgroundColor: theme.palette.background.paper }}>

                        <p><b>{plant.common_name || "Unknown"}</b></p>
                        <p>Species: {plant.scientific_name?.[0] || "Unknown"}</p>

                        {plant.default_image?.small_url === null || plant.default_image?.small_url === "https://perenual.com/storage/image/upgrade_access.jpg" ? (
                          <img src="/public/PlanterLogoTranspo.png" alt="Plant" width="100" />
                        ) : (
                          <img src={plant.default_image?.small_url || "/PlanterLogoTranspo.png"} alt="Plant" width="100" />
                        )}

                        <SearchPlantDetails plantId={plant.id} />

                        <SavePlants plant={plant} details={plantDetails[plant.id]} />
                      </Paper>
                    ))
                  )}</div>
              )}

              {plantList.length === 0 || loading === true ? (
                <p></p>
              ) : (
                <div id="search-pagination">
                  {numSearchPages === 1 ? (
                    <p>No more results to show.</p>
                  ) : (
                    <><p>Viewing page {currentPage} out of {numSearchPages}. Type a page to jump to...</p>
                      <input type="text" placeholder="Enter page #" ref={paginationAreaRef} onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }} />
                      <button onClick={handlePagination}>Jump to page</button></>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div><p>Type something in the search bar to get started!</p></div>
          )}
        </div>
      </div>
      {showSavedPlantsModal && (
        <SavedPlantsModal onClose={() => setShowSavedPlantsModal(false)} onSelect={handleSelectSavedPlant} />
      )}
    </div>
  );
}

export default SearchPlants;