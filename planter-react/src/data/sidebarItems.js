import { Dashboard, Yard, Search, Settings, AccountBox, ExitToApp, ChatBubble, Chat, CalendarMonth } from '@mui/icons-material';


export const sidebarItems = [
  { text: 'Dashboard', path: '/', icon: Dashboard, requiresAuth: true },
  { text: 'My Plants', path: '/my-plants', icon: Yard, requiresAuth: true },
  { text: 'Reminders', path: '/reminders', icon: CalendarMonth, requiresAuth: true },
  { text: 'Search Plants', path: '/search-plants', icon: Search, requiresAuth: true },
  { text: 'AI Assist', path: '/assist', icon: Chat, requiresAuth: true },
];

export const bottomSidebarItems = [
  { text: 'Profile', path: '/profile', icon: AccountBox, requiresAuth: true },
  { text: 'Settings', path: '/settings', icon: Settings, requiresAuth: true },
  { text: 'Logout', icon: ExitToApp, requiresAuth: true, isLogout: true },
];
