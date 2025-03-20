import { useEffect, useState } from "react";

type OutbreakAlertsProps = {
  selectedDisease?: string;
  days: number; // Prop to receive day range from SuperAdminTrends
  outbreakAlerts: Alert[]; // Pre-fetched alerts from SuperAdminTrends
};

type Alert = {
  date: string; // From API: "2025-03-12T00:00:00.000Z"
  disease: string; // From API: "Cholera"
  district: string; // From API: "Ahmedabad"
  cases: number; // From API: 54
};

export function SuperOutbreakAlerts({
  selectedDisease = "all",
  days,
  outbreakAlerts,
}: OutbreakAlertsProps) {
  const [alerts, setAlerts] = useState<any[]>([]); // Using any[] temporarily to accommodate transformed data

   // Day range options
   const dayRanges = [
    { label: "Last 7 Days", value: 7 },
    { label: "Last 30 Days", value: 30 },
    { label: "Last 90 Days", value: 90 },
    { label: "Last 180 Days", value: 180 },
    { label: "Last 365 Days", value: 365 },
  ];

  // Determine severity based on cases
  const getSeverity = (cases: number): "Critical" | "Warning" | "Advisory" => {
    if (cases > 50) return "Critical";
    if (cases > 30) return "Warning";
    return "Advisory";
  };

  // Format timestamp to "X days/hours ago"
  const formatTimestamp = (dateString: string): string => {
    const now = new Date();
    const alertDate = new Date(dateString);
    const diffMs = now.getTime() - alertDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    }
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  };

  // Placeholder for trend (API doesn't provide this)
  const getTrend = (): "increasing" | "decreasing" | "stable" => {
    return "stable"; // Default, as API lacks trend data
  };

  // Transform and filter alerts based on selectedDisease
  useEffect(() => {
    if (!outbreakAlerts || outbreakAlerts.length === 0) {
      setAlerts([]);
      return;
    }

    const transformedAlerts = outbreakAlerts.map((alert: Alert, index: number) => ({
      id: index + 1, // Generate a simple ID
      title: `${alert.disease} Outbreak`,
      location: alert.district,
      severity: getSeverity(alert.cases),
      timestamp: formatTimestamp(alert.date),
      cases: alert.cases,
      trend: getTrend(),
      diseaseType: alert.disease.toLowerCase(),
    }));

    if (selectedDisease === "all") {
      setAlerts(transformedAlerts);
    } else {
      setAlerts(
        transformedAlerts.filter((alert) => alert.diseaseType === selectedDisease.toLowerCase())
      );
    }
  }, [outbreakAlerts, selectedDisease]);

  return (
    <div className="space-y-4 h-80 overflow-auto">
      <div className="bg-white">
        <h2 className="text-xl font-semibold">Outbreak Alerts
        ({dayRanges.find((r) => r.value === days)?.label})

        </h2>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-muted-foreground">
            Showing alerts for {selectedDisease === "all" ? "all diseases" : selectedDisease} (Last {days} Days)
          </p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No alerts found for {selectedDisease} in the last {days} days
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="border-l-4 pl-4 py-2 space-y-1 overflow-auto"
              style={{
                borderColor:
                  alert.severity === "Critical"
                    ? "rgb(239, 68, 68)"
                    : alert.severity === "Warning"
                    ? "rgb(245, 158, 11)"
                    : "rgb(59, 130, 246)",
              }}
            >
              <div className="flex justify-between">
                <h3 className="font-medium">{alert.title}</h3>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor:
                      alert.severity === "Critical"
                        ? "rgba(239, 68, 68, 0.1)"
                        : alert.severity === "Warning"
                        ? "rgba(245, 158, 11, 0.1)"
                        : "rgba(59, 130, 246, 0.1)",
                    color:
                      alert.severity === "Critical"
                        ? "rgb(239, 68, 68)"
                        : alert.severity === "Warning"
                        ? "rgb(245, 158, 11)"
                        : "rgb(59, 130, 246)",
                  }}
                >
                  {alert.severity}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{alert.location}</p>
              <div className="flex justify-between text-xs">
                <span>{alert.cases} cases</span>
                <span
                  className="flex items-center"
                  style={{
                    color:
                      alert.trend === "increasing"
                        ? "rgb(239, 68, 68)"
                        : alert.trend === "decreasing"
                        ? "rgb(34, 197, 94)"
                        : "rgb(59, 130, 246)",
                  }}
                >
                  {alert.trend === "increasing" ? "↑" : alert.trend === "decreasing" ? "↓" : "→"}{" "}
                  {alert.trend}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">{alert.timestamp}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}