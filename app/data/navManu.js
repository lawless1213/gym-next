import {
  IconGauge,
  IconListDetails,
  IconHome2,
  IconSettings,
  IconUser,
  IconStretching,
} from '@tabler/icons-react';

export const navLinks = [
  { link: '/', label: 'home', icon: IconHome2 },
  { link: '/exercises', label: 'exercises', icon: IconListDetails },
  { link: '/programs', label: 'programs', icon: IconGauge, loginRequired: true },
  { link: '/workout', label: 'workout', icon: IconStretching, loginRequired: true },
  { link: '/profile', label: 'profile', icon: IconUser, loginRequired: true },
  { link: '/settings', label: 'settings', icon: IconSettings },
];