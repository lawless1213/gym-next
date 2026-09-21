import { ModalType } from '@/components/modals/modal-renderer';
import { NavItem } from '@/types/navMenu';
import {
  IconHome,
  IconBarbell,
  IconHistory,
  IconChartBar,
  IconAi,
  IconSettings,
} from '@tabler/icons-react';

const navLinks: NavItem[] = [
  { link: '/', label: 'home', icon: <IconHome className="size-6" /> },
  { link: '/library', label: 'library', icon: <IconBarbell className="size-6" /> },
  { link: '/history', label: 'history', icon: <IconHistory className="size-6" />, loginRequired: true },
  { link: '/stats', label: 'stats', icon: <IconChartBar className="size-6" />, loginRequired: true },
  { link: '/settings', label: 'settings', icon: <IconSettings className="size-6" />, loginRequired: true },
  { modal: 'ai', label: 'ai', icon: <IconAi className="size-10" />, loginRequired: true, verifyRequired: true },
];

function getNavLinks(isLoggedIn: boolean) {
  return navLinks.filter((item) => !item.loginRequired || isLoggedIn) ;
}

export {navLinks, getNavLinks};