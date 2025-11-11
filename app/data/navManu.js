import {
  IconGauge,
  IconListDetails,
  IconHome2,
  IconSettings,
  IconUser,
  IconStretching,
} from '@tabler/icons-react';

export const navLinks = [
  { link: '/', label: 'Home', icon: IconHome2 },
  { link: '/exercises', label: 'Exercises', icon: IconListDetails },
  { link: '/programs', label: 'Programs', icon: IconGauge, loginRequired: true },
  { link: '/workout', label: 'Workout', icon: IconStretching, loginRequired: true },
  { link: '/profile', label: 'Profile', icon: IconUser, loginRequired: true },
  { link: '/settings', label: 'Settings', icon: IconSettings },
];