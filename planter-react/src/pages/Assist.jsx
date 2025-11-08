import React, { useState } from "react";
import axios from "axios"; // You'll need to install axios: npm install axios
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRef } from "react";


const Assist = () => {
  const [inputText, setInputText] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const textAreaRef = useRef(null);
  const theme = useTheme(); 

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inputText.trim()) return;

    const newUserMessage = { role: "user", content: inputText };
    setChatLog((prevChatLog) => [...prevChatLog, newUserMessage]);
    setInputText("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5500/api/chat", { // Adjust the URL if your backend is different
        message: inputText,
      });

      const aiReply = { role: "assistant", content: response.data.reply };
      setChatLog((prevChatLog) => [...prevChatLog, aiReply]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again later.",
      };
      setChatLog((prevChatLog) => [...prevChatLog, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
    <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
      AI Assistance
    </Typography>

      <Paper elevation={3} sx={{ p: 2, mb: 2, maxHeight: '50vh', overflowY: 'auto', borderRadius: 2 }}>
        {chatLog.map((message, index) => (
          <Box 
          key={index} 
          sx={{
            mb: 1,
            textAlign: message.role === "user" ? "right" : "left"
          }}
          >
          <Typography
            variant="body1"
            sx={{ fontWeight: 'bold', display: 'inline' }}
          >
            {message.role === "user" ? "You:" : "AI:"}
          </Typography>
          <Typography variant="body1" sx={{ ml: 1, display: "inline" }}>
             {message.content}
          </Typography>
          </Box>
        ))}
        {loading && (
          <Box sx={{ textAlign: "center", mt: 1 }}>
          <CircularProgress size={24} />
          </Box>
        )}
        </Paper>
        
      <Box
      component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", gap: 2 }}
      >
        <TextField
          inputRef={textAreaRef}
          size="small"
          value={inputText}  
          onChange={handleInputChange}
          placeholder="Ask me anything..."
          variant="outlined"
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
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ px: 3 }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Assist;