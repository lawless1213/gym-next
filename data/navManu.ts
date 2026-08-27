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

const navLinks:NavItem[] = [
  { link: '/', label: 'home', icon: IconHome },
  { link: '/library', label: 'library', icon: IconBarbell },
  { link: '/history', label: 'history', icon: IconHistory, loginRequired: true },
  { link: '/stats', label: 'stats', icon: IconChartBar, loginRequired: true },
  { link: '/settings', label: 'settings', icon: IconSettings, loginRequired: true },
  { modal: "ai", label: 'ai', icon: IconAi, loginRequired: true },
];

function getNavLinks(isLoggedIn: boolean) {
  return navLinks.filter((item) => !item.loginRequired || isLoggedIn) ;
}

export {navLinks, getNavLinks};