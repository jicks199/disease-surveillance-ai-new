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

// Transform API data for charts
const transformDataForCharts = (apiData, selectedDayRange) => {
  // Disease Distribution
  const diseaseData =
    apiData.monthlyData[0]?.diseases.map((disease) => ({
      name: disease.name,
      cases: disease.cases,
    })) || [];

  // District Distribution with detailed disease breakdown
  const districtChartData = apiData.districtData.map((district) => ({
    name: district._id,
    value: district.total_cases,
    diseases:
      apiData.monthlyData[0]?.diseases.map((d) => ({
        name: d.name,
        cases: Math.round(
          d.cases * (district.total_cases / apiData.stats.total_cases)
        ), // Proportional distribution
      })) || [],
  }));

  // Top Affected Diseases by District (new feature)
  const topDiseasesByDistrict = apiData.districtData.map((district) => ({
    district: district._id,
    ...Object.fromEntries(
      apiData.monthlyData[0]?.diseases
        .slice(0, 3) // Top 3 diseases for simplicity
        .map((disease) => [
          disease.name,
          Math.round(
            disease.cases * (district.total_cases / apiData.stats.total_cases)
          ),
        ]) || []
    ),
  }));

  return {
    diseaseData,
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

const SuperAdminTrends = ({ data, days }) => {
  const [selectedDayRange, setSelectedDayRange] = useState(7); // Default to 7 days
  const chartData = transformDataForCharts(data, selectedDayRange);
  const finaldays = days;

  // Day range options
  const dayRanges = [
    { label: "Last 7 Days", value: 7 },
    { label: "Last 30 Days", value: 30 },
    { label: "Last 90 Days", value: 90 },
    { label: "Last 180 Days", value: 180 },
    { label: "Last 365 Days", value: 365 },
  ];

  return (
    <div className="space-y-8 ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-3">
        {/* Disease Distribution */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Disease Distribution (
            {dayRanges.find((r) => r.value === finaldays)?.label})
          </h2>
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
                {/* Single Bar Component with Dynamic Colors */}
                <Bar dataKey="cases">
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
        </section>

        {/* Outbreak Alerts */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <SuperOutbreakAlerts
            days={finaldays}
            selectedDisease="all"
            outbreakAlerts={data.outbreakAlerts}
          />
        </div>

        {/* Top Affected Diseases by District (New Feature) */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Top Affected Diseases by District (
            {dayRanges.find((r) => r.value === finaldays)?.label})
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.topDiseasesByDistrict}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="district" />
                <YAxis />
                <Tooltip content={<TopDiseasesTooltip />} />
                <Legend />
                {data.monthlyData[0]?.diseases
                  .slice(0, 3)
                  .map((disease, index) => (
                    <Bar
                      key={disease.name}
                      dataKey={disease.name}
                      fill={COLORS[index % COLORS.length]}
                      name={disease.name}
                    />
                  ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* District-wise Distribution */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            District-wise Distribution (
            {dayRanges.find((r) => r.value === finaldays)?.label})
          </h2>
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
        </section>
      </div>
    </div>
  );
};

export default SuperAdminTrends;
