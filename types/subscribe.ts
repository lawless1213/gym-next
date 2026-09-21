import { type Icon as TablerIcon } from "@tabler/icons-react";

export type PlanId = "monthly" | "yearly" | "lifetime";

export type Plan = {
  id: PlanId;
  price: number;
};

export type Feature = {
  icon: TablerIcon;
  title: string;
  description: string;
  free: boolean;
};
