import React from "react";
import { ListItemButton, ListItemIcon, ListItemText, Button } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { auth } from "../../firebaseConfig";
import { signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

//Logout Button
export const LogoutButton = () => {
    const navigate = useNavigate();
  
    const handleLogout = async () => {
      try {
        await signOut(auth);
        console.log("User logged out successfully");
        navigate("/auth"); // Redirect to login page
      } catch (error) {
        console.error("Logout failed:", error.message);
      }
    };
  
    return (
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    );
  };
  
  // Login Button
  export const LoginButton = ({ email, password, setError }) => {
    const navigate = useNavigate();
  
    const handleLogin = async () => {
      if (!email || !password) {
        setError("Please enter both email and password.");
        return;
      }
  
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        if (!userCredential.user) {
          throw new Error("User does not exist. Please register first.");
        }
  
        alert("Login Successful!");
        navigate("/");
      } catch (err) {
        console.error("Login failed:", err);
  
        const errorMessages = {
          "auth/user-not-found": "No account found. Please register first.",
          "auth/invalid-credential": "No account found. Please register first.", 
          "auth/wrong-password": "Incorrect password. Try again.",
          "auth/invalid-email": "Invalid email format.",
          "auth/too-many-requests": "Too many failed attempts. Try again later.",
          "auth/internal-error": "Internal error. Please try again later."
        };
  
        // Set the error message or default fallback
        setError(errorMessages[err.code] || `Unexpected error: ${err.message}`);
      }
    };
  
    return (
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
    );
  };
  
  //Register Button
  export const RegisterButton = ({ email, password, setError }) => {
    const navigate = useNavigate();
  
    const handleRegister = async () => {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account Created! You can now log in.");
        navigate("/");
      } catch (err) {
        setError(err.message);
      }
    };
  
    return (
      <Button variant="contained" color="primary" onClick={handleRegister}>
        Register
      </Button>
    );
  };
  
  //Save Button
  export const SaveButton = ({ onSave }) => {
    return (
      <Button variant="contained" color="success" onClick={onSave}>
        <SaveIcon /> Save
      </Button>
    );
  };
  