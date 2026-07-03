import { useState } from "react";
import { useRouter } from "next/navigation";
import { subDays, subHours } from "date-fns";

interface UseDashboardHeaderProps {
  setDateRange: (range: { label: string; startDate: string; endDate: string }) => void;
}

export function useDashboardHeader({ setDateRange }: UseDashboardHeaderProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  const dateOptions = [
    {
      label: "Last 24 Hours",
      startDate: subHours(new Date(), 24).toISOString(),
      endDate: new Date().toISOString(),
    },
    {
      label: "Last 7 Days",
      startDate: subDays(new Date(), 7).toISOString(),
      endDate: new Date().toISOString(),
    },
    {
      label: "Last 30 Days",
      startDate: subDays(new Date(), 30).toISOString(),
      endDate: new Date().toISOString(),
    },
  ];

  const handleSelectDateOption = (opt: typeof dateOptions[0]) => {
    setDateRange(opt);
    setDateDropdownOpen(false);
  };

  const handleNavigateToDashboard = () => {
    router.push("/dashboard");
  };

  return {
    dropdownOpen,
    setDropdownOpen,
    dateDropdownOpen,
    setDateDropdownOpen,
    dateOptions,
    handleSelectDateOption,
    handleNavigateToDashboard,
  };
}
