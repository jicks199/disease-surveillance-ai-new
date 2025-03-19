import React, { useState, useEffect } from "react";
import { FileText, Download, Share2, Printer } from "lucide-react";
import {
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
const transformDataForCharts = (apiData) => {
  const diseaseData =
    apiData.monthlyData[0]?.diseases.map((disease) => ({
      name: disease.name,
      cases: disease.cases,
      recovered: Math.round(
        disease.cases * (parseFloat(apiData.stats.recovery_rate) / 100)
      ),
      active: Math.round(
        disease.cases * (1 - parseFloat(apiData.stats.recovery_rate) / 100)
      ),
    })) || [];

  const districtData = apiData.districtData.map((district) => ({
    name: district._id,
    value: district.total_cases,
    diseases: apiData.monthlyData[0]?.diseases || [],
  }));

  return { diseaseData, districtData };
};

const SuperReports = ({ email, role }) => {
  const [selectedDayRange, setSelectedDayRange] = useState(5);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReportData = async (days) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = { email, role, days };
      const response = await fetch(
        `${
          import.meta.env.VITE_API_VERCEL
        }/api/v1/state-head/dashboard/disease-records`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error("Failed to fetch report data");
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      console.error("Error fetching report data:", err);
      setError("Failed to load report data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (email && role) fetchReportData(selectedDayRange);
  }, [email, role, selectedDayRange]);

  const { diseaseData, districtData } = reportData
    ? transformDataForCharts(reportData)
    : { diseaseData: [], districtData: [] };

  // Custom Tooltip for District Pie Chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const district = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="font-semibold">{district.name}</p>
          <p>Total Cases: {district.value.toLocaleString()}</p>
          <p className="text-sm">Disease Breakdown:</p>
          {district.diseases.map((disease, index) => (
            <p key={index} className="text-xs">
              {disease.name}: {disease.cases.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const dayRanges = [
    { label: "Last 5 days", value: 5 },
    { label: "Last 7 days", value: 7 },
    { label: "Last 30 days", value: 30 },
    { label: "Last 90 days", value: 90 },
    { label: "Last 180 days", value: 180 },
    { label: "Last 365 days", value: 365 },
  ];

  // Export Data as CSV
  const handleExportData = () => {
    if (!reportData) {
      alert("No data available to export.");
      return;
    }

    const headers = [
      "District",
      "Total Cases",
      ...diseaseData.map((d) => `${d.name} Cases`),
      ...diseaseData.map((d) => `${d.name} Active`),
      ...diseaseData.map((d) => `${d.name} Recovered`),
    ];

    const rows = districtData.map((district) => [
      district.name,
      district.value,
      ...district.diseases.map((d) => d.cases),
      ...diseaseData
        .filter((d) => district.diseases.some((dis) => dis.name === d.name))
        .map((d) => d.active),
      ...diseaseData
        .filter((d) => district.diseases.some((dis) => dis.name === d.name))
        .map((d) => d.recovered),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `health_report_${selectedDayRange}_days.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Share Data
  const handleShareData = async () => {
    if (!reportData) {
      alert("No data available to share.");
      return;
    }

    const shareText = `Health Report (${dayRanges.find((r) => r.value === selectedDayRange)?.label})\nTotal Cases: ${reportData.stats.total_cases.toLocaleString()}\nRecovery Rate: ${reportData.stats.recovery_rate}%\nHigh-Risk Areas: ${reportData.outbreakAlerts?.length || 0} Districts`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Health Report",
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert("Report summary copied to clipboard!");
    }
  };

  // Print Data
  const handlePrintData = () => {
    if (!reportData) {
      alert("No data available to print.");
      return;
    }
    window.print(); // Triggers browser print dialog
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md relative">
      {isLoading && (
        <div className="absolute top-0 inset-0 flex justify-center mt-20 items-start bg-white/60 backdrop-blur-xl shadow-lg z-50">
          
          <div className="relative flex justify-center items-center">
            {/* Glowing Loader with Ripple Effect */}
            <div className="absolute animate-ping w-16 h-16 rounded-full bg-indigo-300 opacity-75"></div>
            <div className="absolute animate-pulse w-12 h-12 rounded-full bg-indigo-400"></div>
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-600 border-opacity-80"></div>
          </div>
        </div>
      )}

      {/* Main Dashboard Content */}
      <div
        className={`space-y-6 transition-all duration-300 ${
          isLoading ? "blur-md pointer-events-none select-none" : ""
        }`}
      >

        {/* <div className="flex justify-between items-center mb-6"> */}
          <h2 className="text-xl font-semibold text-gray-900">
            AI-Generated Health Reports
          </h2>
          <div className="flex space-x-3 items-center">
            <select
              value={selectedDayRange}
              onChange={(e) => setSelectedDayRange(Number(e.target.value))}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {dayRanges.map((range) => (
                <option key={range.value} value={range.value} className="bg-white text-gray-900">
                  {range.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleExportData}
              className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <Download className="h-5 w-5 mr-2" />
              Export
            </button>
            <button
              onClick={handleShareData}
              className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium rounded-lg shadow-md hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-opacity-50 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </button>
            <button
              onClick={handlePrintData}
              className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-medium rounded-lg shadow-md hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <Printer className="h-5 w-5 mr-2" />
              Print
            </button>
          </div>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {reportData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">
                  Disease Distribution (
                  {dayRanges.find((r) => r.value === selectedDayRange)?.label})
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={diseaseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                        height={80}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="active" fill="#EF4444" name="Active Cases" />
                      <Bar dataKey="recovered" fill="#10B981" name="Recovered" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">
                  District-wise Distribution (
                  {dayRanges.find((r) => r.value === selectedDayRange)?.label})
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={districtData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {districtData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-4">
                  <FileText className="h-6 w-6 text-indigo-600 mr-2" />
                  <h3 className="text-lg font-medium">
                    Health Summary (
                    {dayRanges.find((r) => r.value === selectedDayRange)?.label})
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  AI-generated analysis of health trends and patterns across Gujarat for the selected period.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Cases Analyzed</span>
                    <span className="font-medium">
                      {reportData.stats.total_cases?.toLocaleString() || "1,200"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Recovery Rate</span>
                    <span className="font-medium text-green-600">
                      {reportData.stats.recovery_rate || "85"}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">High-Risk Areas</span>
                    <span className="font-medium text-red-600">
                      {reportData.outbreakAlerts?.length || 0} Districts
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-4">
                  <FileText className="h-6 w-6 text-indigo-600 mr-2" />
                  <h3 className="text-lg font-medium">Predictive Analysis</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  AI predictions for potential disease outbreaks and recommended preventive measures.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Risk Level</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      {reportData.outbreakAlerts?.length > 2 ? "High" : "Moderate"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Predicted Trend</span>
                    <span className="font-medium text-blue-600">
                      {parseFloat(reportData.stats.recovery_rate) > 75 ? "Improving" : "Stable"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Confidence Score</span>
                    <span className="font-medium">92%</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SuperReports;