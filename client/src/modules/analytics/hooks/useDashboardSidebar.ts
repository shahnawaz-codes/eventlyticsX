import { useState } from "react";
import { Home, BarChart2, Compass, Megaphone } from "lucide-react";

export function useDashboardSidebar() {
  const [collapsed, setCollapsed] = useState(true);

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "reports", label: "Reports", icon: BarChart2 },
    { id: "explore", label: "Explore", icon: Compass },
    { id: "advertising", label: "Advertising", icon: Megaphone },
  ];

  return {
    collapsed,
    setCollapsed,
    navigationItems,
  };
}
