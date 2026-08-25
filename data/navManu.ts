import { ModalType } from '@/components/modals/modal-renderer';
import { NavItem } from '@/types/navMenu';
import {
  IconHome,
  IconBarbell,
  IconHistory,
  IconChartBar,
  IconAi,
} from '@tabler/icons-react';

export const navLinks:NavItem[] = [
  { link: '/', label: 'home', icon: IconHome },
  { link: '/library', label: 'library', icon: IconBarbell },
  { link: '/history', label: 'history', icon: IconHistory, loginRequired: true },
  { link: '/stats', label: 'stats', icon: IconChartBar, loginRequired: true },
  { modal: "ai", label: 'ai', icon: IconAi, loginRequired: true },
];

export function getNavLinks(isLoggedIn: boolean) {
  return navLinks.filter((item) => !item.loginRequired || isLoggedIn);
}