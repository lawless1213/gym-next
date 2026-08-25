import { ModalType } from "@/components/modals/modal-renderer";
import { TablerIcon } from "@tabler/icons-react";

type BaseNavItem = {
  label: string;
  icon: TablerIcon;
  loginRequired?: boolean;
};

type LinkNavItem = BaseNavItem & {
  link: string;
  modal?: never;
};

type ModalNavItem = BaseNavItem & {
  modal: ModalType;
  link?: never;
};

export type NavItem = LinkNavItem | ModalNavItem;