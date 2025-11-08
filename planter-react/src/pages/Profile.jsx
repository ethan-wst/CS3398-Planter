// src/pages/ProfilePage.jsx
import React from "react";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Profile</h2>
    </div>
  );
};

export default ProfilePage;
