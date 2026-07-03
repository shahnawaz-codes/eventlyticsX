"use client";

import { useState } from "react";
import { 
  Globe, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Compass, 
  ChevronRight, 
  Search, 
  Share2, 
  Link2,
  MapPin,
  Laptop
} from "lucide-react";

interface BreakdownRow {
  label: string;
  value: number;
  sublabel?: string;
}

interface BreakdownsGridProps {
  breakdowns?: {
    pages?: Array<{ path: string; views: number }>;
    referrers?: Array<{ referrer: string; count: number }>;
    browsers?: Array<{ browser: string; count: number }>;
    os?: Array<{ os: string; count: number }>;
    devices?: Array<{ device: string; count: number }>;
    countries?: Array<{ country: string; count: number }>;
    cities?: Array<{ city: string; count: number }>;
    regions?: Array<{ region: string; count: number }>;
    entryPages?: Array<{ path: string; count: number }>;
    exitPages?: Array<{ path: string; count: number }>;
    campaigns?: Array<{ campaign: string; count: number }>;
    channels?: Array<{ channel: string; count: number }>;
  } | null;
  isLoading?: boolean;
}

// OS Icon helper
const getOSIcon = (os: string) => {
  const name = os.toLowerCase();
  if (name.includes("windows")) return "🪟";
  if (name.includes("mac") || name.includes("os x") || name.includes("darwin")) return "🍏";
  if (name.includes("ios") || name.includes("iphone") || name.includes("ipad")) return "📱";
  if (name.includes("android")) return "🤖";
  if (name.includes("linux")) return "🐧";
  return "💻";
};

// Device Icon helper
const getDeviceIcon = (device: string) => {
  const name = device.toLowerCase();
  if (name === "mobile" || name === "phone") return <Smartphone className="h-4 w-4 text-zinc-500" />;
  if (name === "tablet" || name === "ipad") return <Tablet className="h-4 w-4 text-zinc-500" />;
  return <Monitor className="h-4 w-4 text-zinc-500" />;
};

// Flag emoji helper
const getCountryFlag = (countryName: string) => {
  const code = countryName?.toLowerCase().trim();
  if (code === "united states" || code === "us" || code === "usa") return "🇺🇸";
  if (code === "india" || code === "in") return "🇮🇳";
  if (code === "united kingdom" || code === "gb" || code === "uk" || code === "england") return "🇬🇧";
  if (code === "germany" || code === "de") return "🇩🇪";
  if (code === "japan" || code === "jp") return "🇯🇵";
  if (code === "france" || code === "fr") return "🇫🇷";
  if (code === "canada" || code === "ca") return "🇨🇦";
  if (code === "australia" || code === "au") return "🇦🇺";
  if (code === "brazil" || code === "br") return "🇧🇷";
  if (code === "china" || code === "cn") return "🇨🇳";
  return "🌐";
};

// Sub-component for individual breakdown card panel
interface PanelCardProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  titleLabel: string;
  valueLabel: string;
  rows: BreakdownRow[];
  emptyMessage?: string;
  iconRenderer?: (label: string, activeTab: string) => React.ReactNode;
}

function BreakdownPanelCard({
  tabs,
  activeTab,
  onTabChange,
  titleLabel,
  valueLabel,
  rows,
  emptyMessage = "Waiting for telemetry data...",
  iconRenderer
}: PanelCardProps) {
  const maxVal = rows.length > 0 ? Math.max(...rows.map((r) => r.value), 1) : 1;
  const totalVal = rows.reduce((sum, r) => sum + r.value, 0) || 1;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm flex flex-col min-h-[380px] overflow-hidden select-none hover:shadow-md transition-all">
      {/* Tabs Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-5">
        <div className="flex gap-4 overflow-x-auto scrollbar-none py-2.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`relative pb-1.5 pt-1 text-[11px] font-bold tracking-wider uppercase transition-colors whitespace-nowrap outline-none cursor-pointer ${
                  isActive ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-650"
                }`}
              >
                {tab}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-800 rounded-full animate-in fade-in zoom-in duration-200" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Headers */}
      <div className="flex justify-between items-center px-6 py-3 border-b border-zinc-100 text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-50/20">
        <span>{titleLabel}</span>
        <span className="text-right">{valueLabel}</span>
      </div>

      {/* Body List */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400 text-xs py-10 font-medium">
            {emptyMessage}
          </div>
        ) : (
          rows.slice(0, 7).map((row, idx) => {
            const percentage = (row.value / maxVal) * 100;
            const percentOfTotal = Math.round((row.value / totalVal) * 100);

            return (
              <div key={row.label || idx} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-700">
                  <div className="flex items-center gap-2 truncate max-w-[75%]">
                    {iconRenderer && iconRenderer(row.label, activeTab)}
                    <span className="truncate" title={row.label}>
                      {row.label}
                    </span>
                    {row.sublabel && (
                      <span className="text-[10px] text-zinc-400 font-medium truncate">
                        ({row.sublabel})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 font-bold text-zinc-900 shrink-0">
                    <span>{row.value.toLocaleString()}</span>
                    <span className="text-[10px] text-zinc-400 font-medium w-8 text-right">
                      {percentOfTotal}%
                    </span>
                  </div>
                </div>

                {/* Progress bar container */}
                <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out group-hover:bg-blue-600"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-100 px-6 py-3.5 bg-zinc-50/30 flex items-center justify-between text-[10px] font-bold text-zinc-405 uppercase tracking-wider">
        <span>Analytics breakdown</span>
        <button className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-0.5 cursor-pointer">
          <span>See details</span>
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export default function BreakdownsGrid({ breakdowns, isLoading = false }: BreakdownsGridProps) {
  // Tabs states
  const [acqTab, setAcqTab] = useState("SOURCES");
  const [pagesTab, setPagesTab] = useState("TOP PAGES");
  const [geoTab, setGeoTab] = useState("COUNTRIES");
  const [techTab, setTechTab] = useState("BROWSERS");

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-zinc-200 bg-white h-[380px] p-6 flex flex-col justify-between">
            <div className="flex gap-4 border-b border-zinc-100 pb-3">
              <div className="h-4 w-16 bg-zinc-200 rounded" />
              <div className="h-4 w-16 bg-zinc-200 rounded" />
              <div className="h-4 w-16 bg-zinc-200 rounded" />
            </div>
            <div className="space-y-5 flex-1 py-6">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-3.5 w-32 bg-zinc-200/80 rounded" />
                    <div className="h-3.5 w-12 bg-zinc-200/80 rounded" />
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 rounded" />
                </div>
              ))}
            </div>
            <div className="h-5 w-full bg-zinc-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // --- ACQUISITION DATA PREPARATION ---
  const channelsData = (breakdowns?.channels && breakdowns.channels.length > 0)
    ? breakdowns.channels.map((c) => ({ label: c.channel, value: c.count }))
    : [];
  const sourcesData = (breakdowns?.referrers && breakdowns.referrers.length > 0)
    ? breakdowns.referrers.map((r) => ({ label: r.referrer || "Direct / None", value: r.count }))
    : [];
  const campaignsData = (breakdowns?.campaigns && breakdowns.campaigns.length > 0)
    ? breakdowns.campaigns.map((c) => ({ label: c.campaign, value: c.count }))
    : [];

  const getAcqRows = () => {
    switch (acqTab) {
      case "CHANNELS": return channelsData;
      case "SOURCES": return sourcesData;
      case "CAMPAIGNS": return campaignsData;
      default: return [];
    }
  };

  const acqTitleLabel = acqTab === "SOURCES" ? "Source" : acqTab === "CHANNELS" ? "Channel Group" : "Campaign";
  const acqValueLabel = "Visitors";

  // --- PAGES DATA PREPARATION ---
  const topPagesData = (breakdowns?.pages && breakdowns.pages.length > 0)
    ? breakdowns.pages.map((p) => ({ label: p.path, value: p.views }))
    : [];
  const entryPagesData = (breakdowns?.entryPages && breakdowns.entryPages.length > 0)
    ? breakdowns.entryPages.map((ep) => ({ label: ep.path, value: ep.count }))
    : [];
  const exitPagesData = (breakdowns?.exitPages && breakdowns.exitPages.length > 0)
    ? breakdowns.exitPages.map((ex) => ({ label: ex.path, value: ex.count }))
    : [];

  const getPagesRows = () => {
    switch (pagesTab) {
      case "TOP PAGES": return topPagesData;
      case "ENTRY PAGES": return entryPagesData;
      case "EXIT PAGES": return exitPagesData;
      default: return [];
    }
  };

  const pagesTitleLabel = pagesTab === "TOP PAGES" ? "Page path" : pagesTab === "ENTRY PAGES" ? "Entry page" : "Exit page";
  const pagesValueLabel = pagesTab === "TOP PAGES" ? "Pageviews" : "Sessions";

  // --- GEOGRAPHY DATA PREPARATION ---
  const countriesData = (breakdowns?.countries && breakdowns.countries.length > 0)
    ? breakdowns.countries.map((c) => ({ label: c.country, value: c.count }))
    : [];
  const regionsData = (breakdowns?.regions && breakdowns.regions.length > 0)
    ? breakdowns.regions.map((r) => ({ label: r.region, value: r.count }))
    : [];
  const citiesData = (breakdowns?.cities && breakdowns.cities.length > 0)
    ? breakdowns.cities.map((c) => ({ label: c.city, value: c.count }))
    : [];

  const getGeoRows = () => {
    switch (geoTab) {
      case "MAP": return []; // simple map tab placeholder
      case "COUNTRIES": return countriesData;
      case "REGIONS": return regionsData;
      case "CITIES": return citiesData;
      default: return [];
    }
  };

  const geoTitleLabel = geoTab === "COUNTRIES" ? "Country" : geoTab === "REGIONS" ? "Region" : geoTab === "CITIES" ? "City" : "Location";
  const geoValueLabel = "Visitors";

  // --- TECH DATA PREPARATION ---
  const browsersData = (breakdowns?.browsers && breakdowns.browsers.length > 0)
    ? breakdowns.browsers.map((b) => ({ label: b.browser, value: b.count }))
    : [];
  const osData = (breakdowns?.os && breakdowns.os.length > 0)
    ? breakdowns.os.map((o) => ({ label: o.os, value: o.count }))
    : [];
  const devicesData = (breakdowns?.devices && breakdowns.devices.length > 0)
    ? breakdowns.devices.map((d) => ({ label: d.device, value: d.count }))
    : [];

  const getTechRows = () => {
    switch (techTab) {
      case "BROWSERS": return browsersData;
      case "OPERATING SYSTEMS": return osData;
      case "DEVICES": return devicesData;
      default: return [];
    }
  };

  const techTitleLabel = techTab === "BROWSERS" ? "Browser" : techTab === "OPERATING SYSTEMS" ? "Operating System" : "Device";
  const techValueLabel = "Visitors";

  // Icon renderer helper
  const renderIcon = (label: string, currentActiveTab: string) => {
    if (currentActiveTab === "COUNTRIES") {
      return <span className="text-sm shrink-0 leading-none">{getCountryFlag(label)}</span>;
    }
    if (currentActiveTab === "CITIES" || currentActiveTab === "REGIONS") {
      return <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />;
    }
    if (currentActiveTab === "DEVICES") {
      return getDeviceIcon(label);
    }
    if (currentActiveTab === "OPERATING SYSTEMS") {
      return <span className="text-sm shrink-0 leading-none">{getOSIcon(label)}</span>;
    }
    if (currentActiveTab === "BROWSERS") {
      return <Compass className="h-3.5 w-3.5 text-zinc-400 shrink-0" />;
    }
    if (currentActiveTab === "CHANNELS") {
      if (label.includes("Direct")) return <Link2 className="h-3.5 w-3.5 text-zinc-400 shrink-0" />;
      if (label.includes("Search")) return <Search className="h-3.5 w-3.5 text-zinc-405 shrink-0" />;
      if (label.includes("Social")) return <Share2 className="h-3.5 w-3.5 text-zinc-400 shrink-0" />;
    }
    if (currentActiveTab === "SOURCES") {
      if (label.toLowerCase() === "direct" || label.toLowerCase().includes("none") || label.toLowerCase() === "") {
        return <Link2 className="h-3.5 w-3.5 text-zinc-400 shrink-0" />;
      }
      return <Globe className="h-3.5 w-3.5 text-zinc-400 shrink-0" />;
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full pb-8">
      {/* Panel 1: Acquisition Sources */}
      <BreakdownPanelCard
        tabs={["CHANNELS", "SOURCES", "CAMPAIGNS"]}
        activeTab={acqTab}
        onTabChange={setAcqTab}
        titleLabel={acqTitleLabel}
        valueLabel={acqValueLabel}
        rows={getAcqRows()}
        iconRenderer={renderIcon}
      />

      {/* Panel 2: Pages breakdown */}
      <BreakdownPanelCard
        tabs={["TOP PAGES", "ENTRY PAGES", "EXIT PAGES"]}
        activeTab={pagesTab}
        onTabChange={setPagesTab}
        titleLabel={pagesTitleLabel}
        valueLabel={pagesValueLabel}
        rows={getPagesRows()}
      />

      {/* Panel 3: Geography */}
      <BreakdownPanelCard
        tabs={["MAP", "COUNTRIES", "REGIONS", "CITIES"]}
        activeTab={geoTab}
        onTabChange={setGeoTab}
        titleLabel={geoTitleLabel}
        valueLabel={geoValueLabel}
        rows={getGeoRows()}
        emptyMessage={geoTab === "MAP" ? "Geographical map visualization loading..." : "Waiting for telemetry data..."}
        iconRenderer={renderIcon}
      />

      {/* Panel 4: Devices & Technology */}
      <BreakdownPanelCard
        tabs={["BROWSERS", "OPERATING SYSTEMS", "DEVICES"]}
        activeTab={techTab}
        onTabChange={setTechTab}
        titleLabel={techTitleLabel}
        valueLabel={techValueLabel}
        rows={getTechRows()}
        iconRenderer={renderIcon}
      />
    </div>
  );
}
