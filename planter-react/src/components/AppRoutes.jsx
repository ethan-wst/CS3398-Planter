import React from 'react';
import { Routes, Route, Navigate} from 'react-router-dom';
import { auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

// Page imports
// Page imports
import Dashboard from '/src/pages/Dashboard';
import MyPlants from '/src/pages/Plants/MyPlants';
import PlantProfile from '/src/pages/Plants/PlantProfile';
import EditPlant from '/src/pages/Plants/EditPlant';
import SearchPlants from '/src/pages/SearchPlants';
import Assist from '/src/pages/Assist';
import Profile from '/src/pages/Profile';
import Settings from '/src/pages/Settings/Settings';
import Notifications from '/src/pages/Settings/Notifications';
import Appearance from '/src/pages/Settings/Appearance';
import AuthPage from '/src/pages/AuthPage';
import Reminders from '/src/pages/Reminders'; // Added from SCRUM-33

const ProtectedRoute = ({ children }) => {
  const [user] = useAuthState(auth); // Firebase hook to track user status
  return user ? children : <Navigate to="/auth" replace />; // Redirect if no user
};

/**
 * AppRoutes component sets up the routing for the application.
 * It uses react-router-dom's Routes and Route components to define the 
 * paths and their corresponding components.
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Main routes */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/my-plants" element={<MyPlants />} />
      <Route path="/plant/:id" element={<PlantProfile />} />
      <Route path="/plant/:id/edit" element={<EditPlant />} />
      <Route path="/search-plants" element={<SearchPlants />} />
      <Route path="/assist" element={<Assist />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/reminders" element={<Reminders />} />

      {/* Settings routes */}
      <Route path="/settings" element={<ProtectedRoute> <Settings /> </ProtectedRoute>} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/settings/notifications" element={<ProtectedRoute> <Notifications /> </ProtectedRoute>} />
      <Route path="/settings/appearance" element={<ProtectedRoute> <Appearance /> </ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;
