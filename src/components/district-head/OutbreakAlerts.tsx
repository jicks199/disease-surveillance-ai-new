import { useEffect, useState } from "react"

type OutbreakAlertsProps = {
  selectedDisease?: string
}

type Alert = {
  id: number
  title: string
  location: string
  severity: "Critical" | "Warning" | "Advisory"
  timestamp: string
  cases: number
  trend: "increasing" | "decreasing" | "stable"
  diseaseType: string
}

const allAlerts: Alert[] = [
  {
    id: 1,
    title: "Influenza Outbreak",
    location: "Sector 1",
    severity: "Critical",
    timestamp: "2 hours ago",
    cases: 342,
    trend: "increasing",
    diseaseType: "influenza",
  },
  {
    id: 2,
    title: "Dengue Fever Cases",
    location: "Sector 5",
    severity: "Warning",
    timestamp: "1 day ago",
    cases: 267,
    trend: "increasing",
    diseaseType: "dengue",
  },
  {
    id: 3,
    title: "COVID-19 Cluster",
    location: "Sector 7",
    severity: "Warning",
    timestamp: "6 hours ago",
    cases: 189,
    trend: "stable",
    diseaseType: "covid",
  },
  {
    id: 4,
    title: "Malaria Outbreak",
    location: "Sector 11",
    severity: "Advisory",
    timestamp: "2 days ago",
    cases: 85,
    trend: "increasing",
    diseaseType: "malaria",
  },
  {
    id: 5,
    title: "Typhoid Cases Rising",
    location: "Sector 21",
    severity: "Advisory",
    timestamp: "3 days ago",
    cases: 42,
    trend: "stable",
    diseaseType: "typhoid",
  },
  {
    id: 6,
    title: "Cholera Cluster",
    location: "Sector 15",
    severity: "Warning",
    timestamp: "1 day ago",
    cases: 28,
    trend: "increasing",
    diseaseType: "cholera",
  },
]

export function OutbreakAlerts({ selectedDisease = "all" }: OutbreakAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>(allAlerts)

  useEffect(() => {
    if (selectedDisease === "all") {
      setAlerts(allAlerts)
    } else {
      setAlerts(allAlerts.filter((alert) => alert.diseaseType === selectedDisease))
    }
  }, [selectedDisease])

  return (
    <div className="space-y-4 h-80 overflow-auto ">
      <div className=" bg-white ">
        <h2 className="text-xl font-semibold">Outbreak Alerts</h2>
        <p className="text-sm text-muted-foreground">Showing alerts for {selectedDisease === "all" ? "all diseases" : selectedDisease}</p>
      </div>

      <div className="space-y-4 ">
      {alerts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No alerts found for {selectedDisease}</div>
      ) : (
        alerts.map((alert) => (
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
                {alert.trend === "increasing" ? "↑" : alert.trend === "decreasing" ? "↓" : "→"} {alert.trend}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">{alert.timestamp}</div>
          </div>
        ))
      )}
      </div>
     
    </div>
  )
}

