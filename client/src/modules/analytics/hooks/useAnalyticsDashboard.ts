import { useState } from "react";

export function useAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("home");

  return {
    activeTab,
    setActiveTab,
  };
}
