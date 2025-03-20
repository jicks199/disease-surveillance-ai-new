import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import { OutbreakAlerts } from "./OutbreakAlerts";
import { Bed, Wind, Droplet } from 'lucide-react';

// Colors for charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC107",
  "#FF5722",
];

// Month names
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

// Transform API data for charts
const transformDataForCharts = (apiData, selectedDayRange) => {
  const diseaseData =
    apiData.monthlyData[0]?.diseases?.map((disease) => ({
      name: disease.name,
      cases: disease.cases,
    })) || [];

  const currentDate = new Date("2025-03-18");
  const currentMonthIndex = currentDate.getMonth();

  let monthsToShow;
  switch (selectedDayRange) {
    case 7:
      monthsToShow = 1;
      break;
    case 30:
      monthsToShow = 2;
      break;
    case 90:
      monthsToShow = 4;
      break;
    case 180:
      monthsToShow = 7;
      break;
    case 365:
      monthsToShow = 12;
      break;
    default:
      monthsToShow = 12;
  }

  const filteredMonthlyData = apiData.monthlyData.filter((month) => {
    const monthIndex = month._id - 1;
    const monthsBack = (currentMonthIndex - monthIndex + 12) % 12;
    return monthsBack < monthsToShow;
  });

  const monthlyDiseaseData = filteredMonthlyData.map((month) => ({
    month: MONTH_NAMES[month._id - 1],
    ...Object.fromEntries(
      month.diseases.map((disease) => [disease.name, disease.cases])
    ),
  }));

  return {
    diseaseData,
    monthlyDiseaseData,
  };
};

// Custom Tooltip for Monthly Distribution
const MonthlyTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded shadow border">
        <p className="font-semibold">Month {label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.fill }}>
            {entry.name}: {entry.value} cases
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Component for displaying "Data Not Available" message
const DataNotAvailable = ({ message }) => (
  <div className="h-80 flex items-center justify-center">
    <p className="text-gray-500 text-lg">{message}</p>
  </div>
);

const AdminTrends = ({ data, days }) => {
  const [selectedDayRange, setSelectedDayRange] = useState(7);
  const chartData = transformDataForCharts(data, days);
  const finaldays = days;

  const barWidth = Math.min(50, 500 / (chartData.diseaseData.length || 1));

  const dayRanges = [
    { label: "Last 7 Days", value: 7 },
    { label: "Last 30 Days", value: 30 },
    { label: "Last 90 Days", value: 90 },
    { label: "Last 180 Days", value: 180 },
    { label: "Last 365 Days", value: 365 },
  ];

  const diseaseNames = [
    ...new Set(
      data.monthlyData.flatMap((month) => month.diseases.map((d) => d.name))
    ),
  ];

  const calculatePercentage = (used, total) => {
    return total > 0 ? Math.round((used / total) * 100) : 0;
  };

  // Fallback values if availableResources is missing or incomplete
  const resources = data.availableResources || {};
  const resourceMetrics = {
    total_occupied_beds: resources.total_occupied_beds || 0,
    total_beds: resources.total_beds || 0,
    total_occupied_ventilators: resources.total_occupied_ventilators || 0,
    total_ventilators: resources.total_ventilators || 0,
    total_occupied_oxygen: resources.total_occupied_oxygen || 0,
    total_oxygen_capacity: resources.total_oxygen_capacity || 0,
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-3">
        {/* Disease Distribution */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Disease Distribution (
            {dayRanges.find((r) => r.value === finaldays)?.label || "Unknown"})
          </h2>
          {chartData.diseaseData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.diseaseData}
                  margin={{ top: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={80}
                    dy={10}
                  />
                  <YAxis domain={[0, "dataMax + 50"]} />
                  <Tooltip />
                  <Legend
                    wrapperStyle={{
                      position: "relative",
                      bottom: 25,
                      textAlign: "center",
                      marginBottom: "0px",
                    }}
                  />
                  <Bar dataKey="cases" barSize={barWidth}>
                    {chartData.diseaseData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <DataNotAvailable message="Disease data not available" />
          )}
        </section>

        {/* Outbreak Alerts */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <OutbreakAlerts
            days={finaldays}
            selectedDisease="all"
            outbreakAlerts={data.outbreakAlerts}
          />
        </div>

        {/* Monthly Disease Distribution */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Monthly Disease Distribution (
            {dayRanges.find((r) => r.value === finaldays)?.label || "Unknown"})
          </h2>
          {chartData.monthlyDiseaseData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.monthlyDiseaseData}
                  margin={{ top: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={40}
                    dy={10}
                  />
                  <YAxis domain={[0, "dataMax + 50"]} />
                  <Tooltip content={<MonthlyTooltip />} />
                  <Legend
                    wrapperStyle={{
                      position: "relative",
                      bottom: 25,
                      textAlign: "center",
                    }}
                  />
                  {diseaseNames.map((disease, index) => (
                    <Bar
                      key={disease}
                      dataKey={disease}
                      fill={COLORS[index % COLORS.length]}
                      name={disease}
                      barSize={40}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <DataNotAvailable message="Monthly data not available" />
          )}
        </section>

        {/* Resource Metrics */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          {/* <div className="bg-white rounded-lg shadow-lg p-6"> */}
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Resource Metrics
            ({dayRanges.find((r) => r.value === finaldays)?.label || "Unknown"})

            </h3>
            {data.availableResources ? (
              <div className="grid gap-6 ">
                <div className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <Bed className="w-5 h-5 text-blue-500 mr-2" />
                    <h4 className="text-sm font-medium text-gray-700">Hospital Beds</h4>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Occupancy</span>
                      <span className="text-sm font-medium text-gray-900">
                        {resourceMetrics.total_occupied_beds} / {resourceMetrics.total_beds}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 rounded-full h-2"
                        style={{
                          width: `${calculatePercentage(resourceMetrics.total_occupied_beds, resourceMetrics.total_beds)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <Wind className="w-5 h-5 text-green-500 mr-2" />
                    <h4 className="text-sm font-medium text-gray-700">Ventilators</h4>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">In Use</span>
                      <span className="text-sm font-medium text-gray-900">
                        {resourceMetrics.total_occupied_ventilators} / {resourceMetrics.total_ventilators}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 rounded-full h-2"
                        style={{
                          width: `${calculatePercentage(resourceMetrics.total_occupied_ventilators, resourceMetrics.total_ventilators)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Droplet className="w-5 h-5 text-purple-500 mr-2" />
                    <h4 className="text-sm font-medium text-gray-700">Oxygen Supply</h4>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Current Level</span>
                      <span className="text-sm font-medium text-gray-900">
                        {resourceMetrics.total_occupied_oxygen} / {resourceMetrics.total_oxygen_capacity} L
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 rounded-full h-2"
                        style={{
                          width: `${calculatePercentage(resourceMetrics.total_occupied_oxygen, resourceMetrics.total_oxygen_capacity)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center">Resource data not available</p>
            )}
          {/* </div> */}
        </section>
      </div>
    </div>
  );
};

export default AdminTrends;