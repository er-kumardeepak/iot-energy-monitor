import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

const POLL_INTERVAL = 5000;
const REQUEST_TIMEOUT = 8000;

const navItems = [
  { label: "Overview", icon: "grid", href: "#overview" },
  { label: "Analytics", icon: "chart", href: "#analytics" },
  { label: "Devices", icon: "devices", href: "#devices" },
  { label: "Alerts", icon: "bell", href: "#alerts" },
  { label: "Reports", icon: "report", href: "#reports" },
];

function Icon({ name, size = 20 }) {
  const icons = {
    bolt: <path d="M13.2 2 5 13h6.1L10.8 22 19 11h-6.1L13.2 2Z" />,
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V9M10 19V5M16 19v-7M22 19V2" />
        <path d="M2 19h21" />
      </>
    ),
    devices: (
      <>
        <rect x="5" y="2.5" width="14" height="19" rx="3" />
        <path d="M9 7h6M9 17h.01M12 17h.01M15 17h.01" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    report: (
      <>
        <path d="M6 2h8l4 4v16H6z" />
        <path d="M14 2v5h5M9 12h6M9 16h6" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
    chevron: <path d="m8 10 4 4 4-4" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    refresh: (
      <>
        <path d="M20 7v5h-5M4 17v-5h5" />
        <path d="M6.1 9A7 7 0 0 1 17.6 6.4L20 9M4 15l2.4 2.6A7 7 0 0 0 17.9 15" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12M7 10l5 5 5-5" />
        <path d="M5 21h14" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M8 3v4M16 3v4M3 10h18" />
      </>
    ),
    trendUp: <path d="m4 15 5-5 4 4 7-8M15 6h5v5" />,
    trendDown: <path d="m4 9 5 5 4-4 7 8M15 18h5v-5" />,
    gauge: (
      <>
        <path d="M4.9 19a9 9 0 1 1 14.2 0" />
        <path d="m12 13 4-4" />
        <path d="M6.5 16.5h.01M17.5 16.5h.01M12 6h.01" />
      </>
    ),
    pulse: <path d="M3 12h4l2-6 4 12 3-8 2 2h3" />,
    leaf: (
      <>
        <path d="M20 4c-8 0-14 4-14 10a5 5 0 0 0 5 5c6 0 9-7 9-15Z" />
        <path d="M4 21c2-5 6-9 12-12" />
      </>
    ),
    plug: (
      <>
        <path d="M8 12h8M9 3v5M15 3v5" />
        <path d="M7 8h10v3a5 5 0 0 1-10 0V8ZM12 16v5" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    more: <path d="M5 12h.01M12 12h.01M19 12h.01" />,
    arrow: <path d="m9 18 6-6-6-6" />,
    check: <path d="m5 12 4 4L19 6" />,
    warning: (
      <>
        <path d="M12 3 2.5 20h19L12 3Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4M12 16h.01" />
      </>
    ),
  };

  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

function formatNumber(value, decimals = 1) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return "—";
  return numericValue.toFixed(decimals);
}

function formatTime(value, seconds = false) {
  if (!value) return "Awaiting data";
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    ...(seconds ? { second: "2-digit" } : {}),
  });
}

function formatDate(value) {
  if (!value) return "No reading yet";
  return new Date(value).toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getApiUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");
  if (typeof window === "undefined") return "http://localhost:5000";
  return `${window.location.protocol}//${window.location.hostname}:5000`;
}

function getInitials(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function EnergyChart({ readings }) {
  const chart = useMemo(() => {
    const ordered = [...readings]
      .reverse()
      .filter((item) => Number.isFinite(Number(item.totalPower)));

    if (!ordered.length) return null;

    const width = 760;
    const height = 270;
    const padding = { top: 24, right: 18, bottom: 42, left: 52 };
    const values = ordered.map((item) => Number(item.totalPower));
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const spread = rawMax - rawMin || Math.max(rawMax * 0.15, 10);
    const min = Math.max(0, rawMin - spread * 0.25);
    const max = rawMax + spread * 0.25;

    const points = ordered.map((item, index) => {
      const x =
        padding.left +
        (index / Math.max(ordered.length - 1, 1)) *
          (width - padding.left - padding.right);
      const y =
        padding.top +
        ((max - Number(item.totalPower)) / (max - min || 1)) *
          (height - padding.top - padding.bottom);
      return { x, y, item };
    });

    const linePath = points
      .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
      .join(" ");
    const areaPath = `${linePath} L${points.at(-1).x},${height - padding.bottom} L${points[0].x},${height - padding.bottom} Z`;
    const ticks = Array.from({ length: 4 }, (_, index) => {
      const ratio = index / 3;
      return {
        y: padding.top + ratio * (height - padding.top - padding.bottom),
        value: max - ratio * (max - min),
      };
    });

    const labelIndexes = [...new Set([0, Math.floor((ordered.length - 1) / 2), ordered.length - 1])];

    return { width, height, padding, points, linePath, areaPath, ticks, labelIndexes };
  }, [readings]);

  if (!chart) {
    return (
      <div className="chart-empty">
        <span className="empty-icon"><Icon name="pulse" size={24} /></span>
        <div>
          <strong>Waiting for energy data</strong>
          <p>The live demand chart will appear after the first ESP32 reading.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="energy-chart">
      <svg
        viewBox={`0 0 ${chart.width} ${chart.height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Live active power chart"
      >
        <defs>
          <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5d7c62" stopOpacity=".28" />
            <stop offset="100%" stopColor="#5d7c62" stopOpacity="0" />
          </linearGradient>
          <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
          </filter>
        </defs>

        {chart.ticks.map((tick) => (
          <g key={tick.y}>
            <line
              className="chart-grid-line"
              x1={chart.padding.left}
              x2={chart.width - chart.padding.right}
              y1={tick.y}
              y2={tick.y}
            />
            <text className="chart-axis-label" x="4" y={tick.y + 4}>
              {formatNumber(tick.value, 0)} W
            </text>
          </g>
        ))}

        <path className="chart-area" d={chart.areaPath} />
        <path className="chart-line-glow" d={chart.linePath} filter="url(#lineGlow)" />
        <path className="chart-line" d={chart.linePath} />

        {chart.points.map((point, index) => (
          <g key={point.item.id || `${point.item.timestamp}-${index}`}>
            <circle className="chart-point-halo" cx={point.x} cy={point.y} r="7" />
            <circle className="chart-point" cx={point.x} cy={point.y} r="3.5" />
          </g>
        ))}

        {chart.labelIndexes.map((index) => {
          const point = chart.points[index];
          return (
            <text
              className="chart-time-label"
              key={`label-${index}`}
              x={point.x}
              y={chart.height - 12}
              textAnchor={index === 0 ? "start" : index === chart.points.length - 1 ? "end" : "middle"}
            >
              {formatTime(point.item.timestamp)}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function KpiCard({ icon, label, value, unit, helper, trend, tone = "neutral" }) {
  const trendValue = Number(trend);
  const hasTrend = Number.isFinite(trendValue);
  const trendUp = trendValue >= 0;

  return (
    <article className="kpi-card">
      <div className={`kpi-icon ${tone}`}><Icon name={icon} size={20} /></div>
      <div className="kpi-label-row">
        <span>{label}</span>
        {hasTrend && (
          <span className={`trend-chip ${trendUp ? "up" : "down"}`}>
            <Icon name={trendUp ? "trendUp" : "trendDown"} size={13} />
            {Math.abs(trendValue).toFixed(1)}%
          </span>
        )}
      </div>
      <div className="kpi-value">
        <strong>{value}</strong>
        {unit && <span>{unit}</span>}
      </div>
      <p>{helper}</p>
    </article>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastContact, setLastContact] = useState(null);
  const [historyLimit, setHistoryLimit] = useState(20);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loadMode, setLoadMode] = useState("automatic");
  const [loadStatus, setLoadStatus] = useState(false);
  const apiUrl = useMemo(getApiUrl, []);
  const workspaceName = import.meta.env.VITE_WORKSPACE_NAME || "Energy Operations";
  const userName = import.meta.env.VITE_USER_NAME || "Workspace Admin";

  const fetchDashboard = useCallback(
    async (manual = false) => {
      if (manual) setRefreshing(true);

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      try {
        const deviceParam = selectedDevice ? `?deviceID=${selectedDevice}` : "";
        const [latestResponse, historyResponse] = await Promise.all([
          fetch(`${apiUrl}/api/v1/power-data/latest${deviceParam}`, { signal: controller.signal }),
          fetch(`${apiUrl}/api/v1/power-data?limit=${historyLimit}${selectedDevice ? `&deviceID=${selectedDevice}` : ""}`, {
            signal: controller.signal,
          }),
        ]);

        if (!latestResponse.ok || !historyResponse.ok) {
          throw new Error("The energy service returned an unexpected response.");
        }

        const [latestResult, historyResult] = await Promise.all([
          latestResponse.json(),
          historyResponse.json(),
        ]);

        setData(latestResult.data || null);
        setHistory(historyResult.data || []);
        setLastContact(new Date());
        setError(null);
      } catch (requestError) {
        const message =
          requestError.name === "AbortError"
            ? "The energy service took too long to respond."
            : requestError.message || "Unable to reach the energy service.";
        setError(message);
      } finally {
        window.clearTimeout(timeout);
        setLoading(false);
        setRefreshing(false);
      }
    },
    [apiUrl, historyLimit, selectedDevice],
  );

  const fetchDevices = useCallback(async () => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(`${apiUrl}/api/v1/devices`, { signal: controller.signal });
      if (!response.ok) throw new Error("Failed to fetch devices");
      
      const result = await response.json();
      const deviceList = result.data || [];
      setDevices(deviceList);
      
      // Auto-select first device if none selected
      setSelectedDevice((current) => current || (deviceList.length > 0 ? deviceList[0].deviceID : null));
    } catch (requestError) {
      console.error("Error fetching devices:", requestError);
    } finally {
      window.clearTimeout(timeout);
    }
  }, [apiUrl]);

  const fetchLoadControl = useCallback(async (deviceID) => {
    if (!deviceID) return;
    
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(`${apiUrl}/api/v1/load-control/${deviceID}`, { signal: controller.signal });
      if (!response.ok) throw new Error("Failed to fetch load control state");
      
      const result = await response.json();
      setLoadMode(result.data.mode || "automatic");
      setLoadStatus(result.data.status || false);
    } catch (requestError) {
      console.error("Error fetching load control:", requestError);
    } finally {
      window.clearTimeout(timeout);
    }
  }, [apiUrl]);

  const changeLoadMode = useCallback(async (newMode) => {
    if (!selectedDevice) return;

    try {
      const response = await fetch(`${apiUrl}/api/v1/load-control/${selectedDevice}/mode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: newMode })
      });

      if (!response.ok) throw new Error("Failed to change mode");
      
      const result = await response.json();
      setLoadMode(result.data.mode);
      console.log("✓ Mode changed to:", newMode);
    } catch (err) {
      console.error("Error changing mode:", err);
      alert("Failed to change mode");
    }
  }, [apiUrl, selectedDevice]);

  const toggleLoadPower = useCallback(async (status) => {
    if (!selectedDevice) return;

    try {
      const response = await fetch(`${apiUrl}/api/v1/load-control/${selectedDevice}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }
      
      const result = await response.json();
      setLoadStatus(result.data.status);
      console.log("✓ Load toggled:", status ? "ON" : "OFF");
    } catch (err) {
      console.error("Error toggling load:", err);
      alert(err.message || "Failed to toggle load");
    }
  }, [apiUrl, selectedDevice]);

  useEffect(() => {
    fetchDevices();
    fetchDashboard();
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") fetchDashboard();
    }, POLL_INTERVAL);

    return () => window.clearInterval(interval);
  }, [fetchDashboard, fetchDevices]);

  useEffect(() => {
    if (selectedDevice) {
      fetchLoadControl(selectedDevice);
    }
  }, [selectedDevice, fetchLoadControl]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const metrics = useMemo(() => {
    const activeValues = history
      .map((item) => Number(item.totalPower))
      .filter(Number.isFinite);
    const apparentValues = history
      .map((item) => Number(item.apparentPower))
      .filter(Number.isFinite);
    const factorValues = history
      .map((item) => Number(item.powerFactor))
      .filter(Number.isFinite);

    const average = activeValues.length
      ? activeValues.reduce((sum, value) => sum + value, 0) / activeValues.length
      : Number(data?.totalPower || 0);
    const peak = activeValues.length
      ? Math.max(...activeValues)
      : Number(data?.totalPower || 0);
    const averageApparent = apparentValues.length
      ? apparentValues.reduce((sum, value) => sum + value, 0) / apparentValues.length
      : Number(data?.apparentPower || 0);
    const averageFactor = factorValues.length
      ? factorValues.reduce((sum, value) => sum + value, 0) / factorValues.length
      : Number(data?.powerFactor || 0);
    const current = Number(data?.totalPower || 0);
    const previous = Number(history[1]?.totalPower);
    const loadChange =
      Number.isFinite(previous) && previous !== 0
        ? ((current - previous) / previous) * 100
        : null;

    return {
      average,
      peak,
      averageApparent,
      averageFactor,
      dailyEstimate: (average * 24) / 1000,
      monthlyEstimate: (average * 24 * 30) / 1000,
      loadChange,
    };
  }, [data, history]);

  const systemStatus = useMemo(() => {
    if (error && !data) return { label: "Offline", tone: "critical", detail: "Service unavailable" };
    if (error) return { label: "Data delayed", tone: "warning", detail: "Showing last reading" };
    if (!data) return { label: "Standby", tone: "neutral", detail: "Awaiting first reading" };
    if (Number(data.powerFactor) < 0.85) {
      return { label: "Attention", tone: "warning", detail: "Low power factor" };
    }
    return { label: "Operational", tone: "success", detail: "All systems normal" };
  }, [data, error]);

  const alerts = useMemo(() => {
    if (!data) {
      return [
        {
          tone: "neutral",
          icon: "clock",
          title: "Waiting for first device reading",
          body: "The workspace is connected and ready to receive ESP32 telemetry.",
        },
      ];
    }

    const items = [];
    if (Number(data.powerFactor) < 0.85) {
      items.push({
        tone: "warning",
        icon: "warning",
        title: "Power factor below target",
        body: `Current factor is ${formatNumber(data.powerFactor, 3)}. Review inductive loads or correction equipment.`,
      });
    }
    if (Number(data.totalPower) > 100) {
      items.push({
        tone: "warning",
        icon: "trendUp",
        title: "Elevated active load",
        body: `Demand is ${formatNumber(data.totalPower)} W, above the configured 100 W watch threshold.`,
      });
    }
    if (!items.length) {
      items.push({
        tone: "success",
        icon: "check",
        title: "No active energy alerts",
        body: "Demand and power quality are currently within the recommended operating range.",
      });
    }
    return items;
  }, [data]);

  const exportCsv = () => {
    if (!history.length) return;
    const headers = [
      "timestamp",
      "deviceID",
      "totalPower",
      "apparentPower",
      "reactivePower",
      "powerFactor",
    ];
    const rows = history.map((reading) =>
      headers.map((header) => JSON.stringify(reading[header] ?? "")).join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `gridline-energy-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <main className="app-loading">
        <div className="loading-brand"><Icon name="bolt" size={23} /></div>
        <div className="loading-copy">
          <span>Gridline energy cloud</span>
          <strong>Preparing your workspace</strong>
        </div>
        <div className="loading-bar"><span /></div>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <button
        className={`nav-scrim ${mobileNavOpen ? "visible" : ""}`}
        type="button"
        aria-label="Close navigation"
        onClick={() => setMobileNavOpen(false)}
      />

      <aside className={`sidebar ${mobileNavOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <a className="logo" href="#overview" onClick={() => setMobileNavOpen(false)}>
            <span className="logo-mark"><Icon name="bolt" size={20} /></span>
            <span className="logo-type">gridline</span>
          </a>
          <button
            className="sidebar-close"
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="workspace-switcher">
          <span className="workspace-avatar">{getInitials(workspaceName)}</span>
          <span>
            <small>Workspace</small>
            <strong>{workspaceName}</strong>
          </span>
        </div>

        <nav className="primary-nav" aria-label="Primary navigation">
          <span className="nav-label">Workspace</span>
          {navItems.map((item, index) => (
            <a
              className={index === 0 ? "active" : ""}
              href={item.href}
              key={item.label}
              onClick={() => setMobileNavOpen(false)}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
              {item.label === "Alerts" && alerts.some((alert) => alert.tone === "warning") && (
                <i className="nav-notification" />
              )}
            </a>
          ))}
          <span className="nav-label management-label">Management</span>
          <a href="#settings" onClick={() => setMobileNavOpen(false)}>
            <Icon name="settings" size={19} />
            <span>Settings</span>
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="plan-card">
            <div className="plan-card-top">
              <span>Pro workspace</span>
              <span>20%</span>
            </div>
            <div className="plan-progress"><span /></div>
            <p>1 of 5 device connections used</p>
            <button type="button">Manage plan <Icon name="arrow" size={14} /></button>
          </div>

          <div className="user-menu">
            <span className="user-avatar">{getInitials(userName)}</span>
            <span>
              <strong>{userName}</strong>
              <small>Administrator</small>
            </span>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu"
              type="button"
              aria-label="Open navigation"
              onClick={() => setMobileNavOpen(true)}
            >
              <Icon name="menu" />
            </button>
            <div className="breadcrumb">
              <span>{workspaceName}</span>
              <Icon name="arrow" size={14} />
              <strong>Overview</strong>
            </div>
            {devices.length > 0 && (
              <div className="device-selector">
                <label htmlFor="device-select" className="device-selector-label">
                  <Icon name="devices" size={16} />
                  <select
                    id="device-select"
                    value={selectedDevice || ""}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    aria-label="Select device"
                  >
                    {devices.map((device) => (
                      <option key={device.deviceID} value={device.deviceID}>
                        {device.deviceID} {device.lastReading ? "• Online" : "• Offline"}
                      </option>
                    ))}
                  </select>
                  <Icon name="chevron" size={14} />
                </label>
              </div>
            )}
          </div>

          <div className="topbar-right">
            <div className={`connection-status ${systemStatus.tone}`}>
              <i />
              <span>
                <strong>{systemStatus.label}</strong>
                <small>{systemStatus.detail}</small>
              </span>
            </div>
            <button
              className="icon-button"
              type="button"
              aria-label="Refresh energy data"
              disabled={refreshing}
              onClick={() => fetchDashboard(true)}
            >
              <Icon name="refresh" size={18} />
            </button>
          </div>
        </header>

        <main className="page-content" id="overview">
          <section className="page-heading">
            <div>
              <span className="eyebrow">Operational dashboard</span>
              <h1>Energy overview</h1>
              <p>
                Monitor demand, power quality, and connected equipment across your workspace.
              </p>
            </div>
            <div className="page-actions">
              <label className="range-control">
                <Icon name="calendar" size={17} />
                <select
                  value={historyLimit}
                  onChange={(event) => setHistoryLimit(Number(event.target.value))}
                  aria-label="Chart reading range"
                >
                  <option value="20">Last 20 readings</option>
                  <option value="50">Last 50 readings</option>
                  <option value="100">Last 100 readings</option>
                </select>
                <Icon name="chevron" size={15} />
              </label>
              <button
                className="secondary-button"
                type="button"
                onClick={exportCsv}
                disabled={!history.length}
              >
                <Icon name="download" size={17} />
                Export CSV
              </button>
            </div>
          </section>

          {error && (
            <section className="service-banner" role="alert">
              <span className="service-banner-icon"><Icon name="warning" size={20} /></span>
              <div>
                <strong>Live data connection interrupted</strong>
                <p>{error} Existing readings remain available while we reconnect.</p>
              </div>
              <button type="button" onClick={() => fetchDashboard(true)}>Retry now</button>
            </section>
          )}

          <section className="kpi-grid" aria-label="Key energy metrics">
            <KpiCard
              icon="pulse"
              tone="green"
              label="Live demand"
              value={formatNumber(data?.totalPower)}
              unit="W"
              trend={metrics.loadChange}
              helper={`Average ${formatNumber(metrics.average)} W over this period`}
            />
            <KpiCard
              icon="gauge"
              tone="amber"
              label="Power factor"
              value={formatNumber(data?.powerFactor, 3)}
              helper={
                Number(data?.powerFactor) >= 0.95
                  ? "Excellent power quality"
                  : Number(data?.powerFactor) >= 0.85
                    ? "Within healthy operating range"
                    : "Below recommended operating range"
              }
            />
            <KpiCard
              icon="plug"
              tone="blue"
              label="Apparent power"
              value={formatNumber(data?.apparentPower)}
              unit="VA"
              helper={`Period average ${formatNumber(metrics.averageApparent)} VA`}
            />
            <KpiCard
              icon="leaf"
              tone="sage"
              label="Daily energy estimate"
              value={formatNumber(metrics.dailyEstimate, 2)}
              unit="kWh"
              helper={`${formatNumber(metrics.monthlyEstimate, 1)} kWh projected monthly`}
            />
          </section>

          <section className="load-control-section">
            <article className="load-control-card">
              <div className="card-heading">
                <div>
                  <span className="eyebrow">Load Management</span>
                  <h2>Power Control</h2>
                  <p>Switch between automatic and manual mode to control load power.</p>
                </div>
              </div>

              <div className="load-control-content">
                <div className="mode-selector">
                  <span className="mode-label">Mode:</span>
                  <div className="mode-buttons">
                    <button
                      className={`mode-btn ${loadMode === "automatic" ? "active" : ""}`}
                      type="button"
                      onClick={() => changeLoadMode("automatic")}
                    >
                      <Icon name="pulse" size={16} />
                      Automatic
                    </button>
                    <button
                      className={`mode-btn ${loadMode === "manual" ? "active" : ""}`}
                      type="button"
                      onClick={() => changeLoadMode("manual")}
                    >
                      <Icon name="settings" size={16} />
                      Manual
                    </button>
                  </div>
                </div>

                {loadMode === "manual" && (
                  <div className="load-toggle">
                    <span className="toggle-label">Load Status:</span>
                    <button
                      className={`load-button ${loadStatus ? "on" : "off"}`}
                      type="button"
                      onClick={() => toggleLoadPower(!loadStatus)}
                      aria-label={`Turn load ${loadStatus ? "off" : "on"}`}
                    >
                      <i className="load-indicator" />
                      <span>{loadStatus ? "ON" : "OFF"}</span>
                    </button>
                  </div>
                )}

                {loadMode === "automatic" && (
                  <div className="auto-notice">
                    <Icon name="info" size={18} />
                    <span>In automatic mode, load is controlled by the system based on power conditions.</span>
                  </div>
                )}
              </div>
            </article>
          </section>

          <section className="analytics-grid" id="analytics">
            <article className="content-card demand-card">
              <div className="card-heading">
                <div>
                  <span className="eyebrow">Demand analytics</span>
                  <h2>Active power trend</h2>
                  <p>Live load profile from your connected energy monitor.</p>
                </div>
                <div className="chart-legend"><i /> Active power</div>
              </div>
              <EnergyChart readings={history} />
              <div className="chart-summary">
                <div>
                  <span>Period average</span>
                  <strong>{formatNumber(metrics.average)} W</strong>
                </div>
                <div>
                  <span>Period peak</span>
                  <strong>{formatNumber(metrics.peak)} W</strong>
                </div>
                <div>
                  <span>Latest reading</span>
                  <strong>{formatTime(data?.timestamp, true)}</strong>
                </div>
              </div>
            </article>

            <article className="content-card quality-card">
              <div className="card-heading">
                <div>
                  <span className="eyebrow">Efficiency score</span>
                  <h2>Power quality</h2>
                </div>
                <button className="quiet-button" type="button" aria-label="Power quality options">
                  <Icon name="more" size={18} />
                </button>
              </div>

              <div
                className="quality-gauge"
                style={{ "--score": `${Math.max(0, Math.min(100, Number(data?.powerFactor || 0) * 100))}%` }}
              >
                <div>
                  <strong>{formatNumber(Number(data?.powerFactor || 0) * 100, 0)}</strong>
                  <span>out of 100</span>
                </div>
              </div>

              <div className="quality-copy">
                <span className={`quality-label ${Number(data?.powerFactor) >= 0.85 ? "success" : "warning"}`}>
                  <i />
                  {Number(data?.powerFactor) >= 0.95
                    ? "Excellent"
                    : Number(data?.powerFactor) >= 0.85
                      ? "Healthy"
                      : "Needs attention"}
                </span>
                <p>
                  {Number(data?.powerFactor) >= 0.85
                    ? "Your electrical system is using supplied power efficiently."
                    : "Investigate inductive loads to reduce avoidable reactive demand."}
                </p>
              </div>

              <div className="quality-stats">
                <div>
                  <span>Average factor</span>
                  <strong>{formatNumber(metrics.averageFactor, 3)}</strong>
                </div>
                <div>
                  <span>Reactive power</span>
                  <strong>{formatNumber(data?.reactivePower)} VAR</strong>
                </div>
              </div>
            </article>
          </section>

          <section className="operations-section" id="devices">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Operations</span>
                <h2>Connected devices</h2>
                <p>Health and telemetry status for your workspace equipment.</p>
              </div>
              <button className="text-button" type="button">View all devices <Icon name="arrow" size={15} /></button>
            </div>

            <article className="device-table-card">
              <div className="device-table-scroll">
                <div className="device-row device-row-head" role="row">
                  <span>Device</span>
                  <span>Status</span>
                  <span>Live demand</span>
                  <span>Power factor</span>
                  <span>Last reading</span>
                  <span />
                </div>
                {devices.length > 0 ? devices.map((device) => {
                  const isSelected = selectedDevice === device.deviceID;
                  const latestReading = device.lastReading;
                  return (
                    <div 
                      key={device.deviceID}
                      className={`device-row ${isSelected ? "selected" : ""}`}
                      role="row"
                      onClick={() => setSelectedDevice(device.deviceID)}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="device-name">
                        <i><Icon name="devices" size={19} /></i>
                        <span>
                          <strong>{device.deviceID}</strong>
                          <small>{latestReading ? "Main distribution board" : "No data"}</small>
                        </span>
                      </span>
                      <span>
                        <span className={`status-badge ${latestReading ? "success" : "neutral"}`}>
                          <i /> {latestReading ? "Online" : "Offline"}
                        </span>
                      </span>
                      <span><strong>{latestReading ? formatNumber(latestReading.totalPower) : "—"}</strong> W</span>
                      <span>{latestReading ? formatNumber(latestReading.powerFactor, 3) : "—"}</span>
                      <span>
                        <strong>{latestReading ? formatTime(latestReading.timestamp) : "—"}</strong>
                        <small>{latestReading ? formatDate(latestReading.timestamp) : "No reading"}</small>
                      </span>
                      <span><button className="quiet-button" type="button" aria-label="Device options"><Icon name="more" size={18} /></button></span>
                    </div>
                  );
                }) : (
                  <div className="device-row" role="row">
                    <span className="device-name">
                      <i><Icon name="devices" size={19} /></i>
                      <span>
                        <strong>{data?.deviceID || "ESP32 Energy Monitor"}</strong>
                        <small>Main distribution board</small>
                      </span>
                    </span>
                    <span>
                      <span className={`status-badge ${systemStatus.tone}`}>
                        <i /> {systemStatus.label}
                      </span>
                    </span>
                    <span><strong>{formatNumber(data?.totalPower)}</strong> W</span>
                    <span>{formatNumber(data?.powerFactor, 3)}</span>
                    <span>
                      <strong>{formatTime(data?.timestamp)}</strong>
                      <small>{formatDate(data?.timestamp)}</small>
                    </span>
                    <span><button className="quiet-button" type="button" aria-label="Device options"><Icon name="more" size={18} /></button></span>
                  </div>
                )}
              </div>
            </article>
          </section>

          <section className="insights-grid" id="alerts">
            <article className="content-card alerts-card">
              <div className="card-heading">
                <div>
                  <span className="eyebrow">Smart monitoring</span>
                  <h2>Alerts & recommendations</h2>
                </div>
                <span className="alert-count">{alerts.length}</span>
              </div>

              <div className="alert-list">
                {alerts.map((alert) => (
                  <div className={`alert-item ${alert.tone}`} key={alert.title}>
                    <span className="alert-icon"><Icon name={alert.icon} size={19} /></span>
                    <div>
                      <strong>{alert.title}</strong>
                      <p>{alert.body}</p>
                    </div>
                    <Icon name="arrow" size={16} />
                  </div>
                ))}
              </div>
            </article>

            <article className="content-card sustainability-card">
              <div className="sustainability-icon"><Icon name="leaf" size={22} /></div>
              <span className="eyebrow">Energy intelligence</span>
              <h2>Your current load is equivalent to</h2>
              <div className="equivalent-value">
                <strong>{formatNumber(Number(data?.totalPower || 0) / 9, 1)}</strong>
                <span>LED bulbs</span>
              </div>
              <p>
                Based on a typical 9 W LED bulb. Use this comparison to make live demand easier to understand.
              </p>
              <div className="sustainability-footer">
                <Icon name="shield" size={17} />
                <span>Calculated locally from live telemetry</span>
              </div>
            </article>
          </section>

          <details className="diagnostics-card" id="reports">
            <summary>
              <span>
                <Icon name="report" size={18} />
                API diagnostics and raw payload
              </span>
              <Icon name="chevron" size={17} />
            </summary>
            <div className="diagnostics-body">
              <div>
                <span>API endpoint</span>
                <code>{apiUrl}/api/v1/power-data</code>
                <span>Last successful contact</span>
                <code>{lastContact ? lastContact.toISOString() : "No successful contact"}</code>
              </div>
              <pre>{data ? JSON.stringify(data, null, 2) : "No payload received yet."}</pre>
            </div>
          </details>

          <section className="settings-anchor" id="settings" aria-hidden="true" />
        </main>

        <footer className="app-footer">
          <span>© {new Date().getFullYear()} Gridline Energy Cloud</span>
          <span>Privacy</span>
          <span>System status</span>
          <span>API v1</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
