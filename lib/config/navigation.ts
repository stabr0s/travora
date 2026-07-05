import {
  LayoutDashboard,
  Luggage,
  Map,
  MapPin,
  Settings,
  Wallet,
} from "lucide-react";

import type { NavItem } from "@/types/navigation";

export const navigationItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    sidebar: true,
    mobile: true,
  },
  {
    label: "Trips",
    href: "/trips",
    icon: MapPin,
    sidebar: true,
    mobile: true,
  },
  {
    label: "Map",
    href: "/map",
    icon: Map,
    sidebar: true,
    mobile: true,
  },
  {
    label: "Budget",
    href: "/budget",
    icon: Wallet,
    sidebar: true,
    mobile: true,
  },
  {
    label: "Packing",
    href: "/packing",
    icon: Luggage,
    sidebar: true,
    mobile: false,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    sidebar: true,
    mobile: true,
  },
];

export const sidebarNavigation = navigationItems.filter((item) => item.sidebar);

export const mobileNavigation = navigationItems.filter((item) => item.mobile);
