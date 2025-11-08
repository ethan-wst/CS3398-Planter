import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Paper, Button, TextField } from "@mui/material";

const PlantProfile = () => {
  const { id } = useParams(); //Get plant ID from URL
  const [plant, setPlant] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [shareableLink, setShareableLink] = useState("");

  useEffect(() => {
    const plants = JSON.parse(localStorage.getItem("plants")) || [];
    const foundPlant = plants.find((p) => String(p.id) === String(id));

    if (foundPlant) {
      setPlant(foundPlant);
      setComments(foundPlant.comments || []);
      setShareableLink(`${window.location.origin}/plant/${id}`);
    }
  }, [id]);

  //Copy Shareable Link
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    alert("Link copied to clipboard!");
  };

  //Add a Comment
  const addComment = () => {
    if (!comment.trim()) return;

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    setComment("");

    //Update localStorage
    const plants = JSON.parse(localStorage.getItem("plants")) || [];
    const updatedPlants = plants.map((p) =>
      String(p.id) === String(id) ? { ...p, comments: updatedComments } : p
    );
    localStorage.setItem("plants", JSON.stringify(updatedPlants));
  };

  if (!plant) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 3, marginTop: 5 }}>
          <Typography variant="h5" sx={{ textAlign: "center", color: "red" }}>
             Plant Profile Not Found
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {plant.name} Profile
        </Typography>
        <Typography variant="h6" color="textSecondary">
          🌿 Species: {plant.species}
        </Typography>

        {/*Shareable Link */}
        <Typography sx={{ fontSize: "14px", marginTop: 2, wordWrap: "break-word", color: "black" }}>
          <u> {shareableLink} </u>
        </Typography>
        <Button onClick={copyToClipboard} sx={{ color: "green", marginTop: 1 }}>
          Copy Link
        </Button>

        {/*Comments Section */}
        <Typography variant="h6" sx={{ marginTop: 3, fontWeight: "bold" }}>
          💬 Comments
        </Typography>
        {comments.length === 0 ? (
          <Typography sx={{ fontStyle: "italic", color: "gray" }}>No comments yet.</Typography>
        ) : (
          comments.map((c, index) => (
            <Paper key={index} sx={{ padding: 1, marginTop: 1, backgroundColor: "#f8f8f8" }}>
              {c}
            </Paper>
          ))
        )}

        {/*Add Comment Field */}
        <TextField
          fullWidth
          variant="outlined"
          label="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ marginTop: 2 }}
        />
        <Button variant="contained" onClick={addComment} sx={{ marginTop: 1, backgroundColor: "#50715c" }}>
          Submit
        </Button>
      </Paper>
    </Container>
  );
};

export default PlantProfile;
