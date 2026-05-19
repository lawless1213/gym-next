import {
  IconHome,
  IconBarbell,
  IconHistory,
  IconChartBar
} from '@tabler/icons-react';

export const navLinks = [
  { link: '/', label: 'home', icon: IconHome },
  { link: '/library', label: 'library', icon: IconBarbell },
  { link: '/history', label: 'history', icon: IconHistory, loginRequired: true },
  { link: '/stats', label: 'stats', icon: IconChartBar, loginRequired: true },
];

export function getNavLinks(isLoggedIn) {
  return navLinks.filter((item) => !item.loginRequired || isLoggedIn);
}