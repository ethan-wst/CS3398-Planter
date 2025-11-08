// src/data/settingsSidebarItems.js
import { 
  Settings,
  Notifications, 
  ColorLens
} from '@mui/icons-material';

export const settingsSidebarItems = [
  {
    text: 'General',
    path: '/settings',
    icon: Settings,
    requiresAuth: true
  },
  { 
    text: 'Appearance', 
    path: '/settings/appearance', 
    icon: ColorLens,
    requiresAuth: true
  },
  { 
    text: 'Notifications', 
    path: '/settings/notifications', 
    icon: Notifications, 
    requiresAuth: true
  },
];