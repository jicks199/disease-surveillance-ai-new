import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { SuperOutbreakAlerts } from "./SuperOutbreakAlerts";

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
  // Disease Distribution
  const diseaseData =
    apiData.monthlyData[0]?.diseases?.map((disease) => ({
      name: disease.name,
      cases: disease.cases,
    })) || [];

  // Get current date (March 18, 2025) and current month (March = 2 in 0-based index)
  const currentDate = new Date("2025-03-18");
  const currentMonthIndex = currentDate.getMonth(); // 2 for March

  // Calculate how many months to show based on day range
  let monthsToShow;
  switch (selectedDayRange) {
    case 7:
      monthsToShow = 1; // Current month only
      break;
    case 30:
      monthsToShow = 2; // Current and previous month
      break;
    case 90:
      monthsToShow = 4; // Roughly 3 months + current
      break;
    case 180:
      monthsToShow = 7; // Roughly 6 months + current
      break;
    case 365:
      monthsToShow = 12; // Full year
      break;
    default:
      monthsToShow = 12;
  }

  // Filter monthly data based on selected range
  const filteredMonthlyData = apiData.monthlyData.filter((month) => {
    const monthIndex = month._id - 1; // Convert to 0-based index
    // Calculate how many months back from current month
    const monthsBack = (currentMonthIndex - monthIndex + 12) % 12;
    return monthsBack < monthsToShow;
  });

  // Transform filtered monthly data
  const monthlyDiseaseData = filteredMonthlyData.map((month) => ({
    month: MONTH_NAMES[month._id - 1],
    ...Object.fromEntries(
      month.diseases.map((disease) => [disease.name, disease.cases])
    ),
  }));

  // District Distribution with detailed disease breakdown
  const districtChartData =
    apiData.districtData?.map((district) => ({
      name: district._id,
      value: district.total_cases,
      diseases:
        apiData.monthlyData[0]?.diseases?.map((d) => ({
          name: d.name,
          cases: Math.round(
            d.cases * (district.total_cases / apiData.stats.total_cases)
          ),
        })) || [],
    })) || [];

  // Top Affected Diseases by District
  const topDiseasesByDistrict =
    apiData.districtData?.map((district) => ({
      district: district._id,
      ...Object.fromEntries(
        apiData.monthlyData[0]?.diseases
          ?.slice(0, 3)
          .map((disease) => [
            disease.name,
            Math.round(
              disease.cases * (district.total_cases / apiData.stats.total_cases)
            ),
          ]) || []
      ),
    })) || [];

  return {
    diseaseData,
    monthlyDiseaseData,
    districtChartData,
    topDiseasesByDistrict,
  };
};

// Custom Tooltip for District Pie Chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const district = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded shadow border">
        <p className="font-semibold">{district.name}</p>
        <p>Total Cases: {district.value}</p>
        <div className="mt-2">
          <p className="font-medium">Disease Breakdown:</p>
          {district.diseases.map((disease, index) => (
            <p key={index} className="text-sm">
              {disease.name}: {disease.cases}
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
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

// Custom Tooltip for Top Diseases Bar Chart
const TopDiseasesTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded shadow border">
        <p className="font-semibold">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.stroke }}>
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

const SuperAdminTrends = ({ data, days }) => {
  const [selectedDayRange, setSelectedDayRange] = useState(7);
  const chartData = transformDataForCharts(data, days); // Use days prop directly
  const finaldays = days;

  const barWidth = Math.min(50, 500 / (chartData.diseaseData.length || 1));

  const dayRanges = [
    { label: "Last 7 Days", value: 7 },
    { label: "Last 30 Days", value: 30 },
    { label: "Last 90 Days", value: 90 },
    { label: "Last 180 Days", value: 180 },
    { label: "Last 365 Days", value: 365 },
  ];

  // Get unique disease names from monthly data
  const diseaseNames = [
    ...new Set(
      data.monthlyData.flatMap((month) => month.diseases.map((d) => d.name))
    ),
  ];

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
          <SuperOutbreakAlerts
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
                    height={80}
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

        {/* District-wise Distribution */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            District-wise Distribution (
            {dayRanges.find((r) => r.value === finaldays)?.label || "Unknown"})
          </h2>
          {chartData.districtChartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.districtChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.districtChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <DataNotAvailable message="District data not available" />
          )}
        </section>
      </div>
    </div>
  );
};

export default SuperAdminTrends;