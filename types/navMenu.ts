import { ModalType } from "@/components/modals/modal-renderer";
import { ReactNode } from "react";

type BaseNavItem = {
  label: string;
  icon: ReactNode;
  loginRequired?: boolean;
  verifyRequired?: boolean;
  subscribeRequired?: boolean;
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