import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  MapPin,
  Thermometer,
  Users,
  Activity,
  AlertTriangle,
  TrendingUp,
  Download,
  Calendar
} from 'lucide-react';
import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/Loader.json';

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: number | string;
  change?: number;
  color?: string;
}

const StatCard = ({ icon: Icon, title, value, change, color = 'blue' }: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center">
      <div className={`p-3 bg-${color}-50 rounded-lg`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {change !== undefined && (
          <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
            {change >= 0 ? '+' : ''}{change}%
            <TrendingUp className="h-4 w-4 ml-1" />
            <span className="ml-1">from last month</span>
          </p>
        )}
      </div>
    </div>
  </div>
);

// Month names
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
];

// Colors for charts
const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8",
  "#82CA9D", "#FFC107", "#FF5722", "#A569BD", "#F08080"
];

// Transform API data for charts
const transformDataForCharts = (apiData, selectedDayRange) => {
  if (!apiData) return { monthlyDiseaseData: [], districtChartData: [] };

  // Monthly Data Transformation
  const currentDate = new Date();
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
    default:
      monthsToShow = 4;
  }

  const filteredMonthlyData = apiData.monthlyData
    ?.filter((month) => {
      const monthIndex = month._id - 1;
      const monthsBack = (currentMonthIndex - monthIndex + 12) % 12;
      return monthsBack < monthsToShow;
    })
    .sort((a, b) => a._id - b._id) || [];

  const monthlyDiseaseData = filteredMonthlyData.map((month) => ({
    name: MONTH_NAMES[month._id - 1],
    cases: month.diseases[0]?.cases || 0,
    active: month.diseases[0]?.active_cases || 0,
    recoveries: month.diseases[0]?.recovered_cases || 0,
  }));

  // District Data Transformation
  const districtChartData = apiData.districtData?.map((district) => ({
    name: district._id,
    value: district.total_cases,
    diseases: apiData.monthlyData[0]?.diseases?.map((d) => ({
      name: d.name,
      cases: Math.round(
        d.cases * (district.total_cases / (apiData.stats.total_cases || 1))
      ),
    })) || [],
  })) || [];

  return { monthlyDiseaseData, districtChartData };
};

// Custom Tooltip for Monthly Chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded shadow border">
        <p className="font-semibold">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.stroke || entry.fill }}>
            {entry.name}: {entry.value} cases
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom Tooltip for District Pie Chart
const DistrictTooltip = ({ active, payload }) => {
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

// Component for displaying "Data Not Available" message
const DataNotAvailable = ({ message }) => (
  <div className="h-80 flex items-center justify-center">
    <p className="text-gray-500 text-lg">{message}</p>
  </div>
);

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState(30);
  const [district, setDistrict] = useState('Ahmedabad');
  const [disease, setDisease] = useState('');
  const [allDistrictData, setAllDistrictData] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const districts = [
    'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 
    'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 
    'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 
    'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 
    'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 
    'Tapi', 'Vadodara', 'Valsad'
  ];

  const timeRanges = [
    { label: 'Last 30 days', value: 30 },
    { label: 'Last 3 months', value: 90 },
    { label: 'Last 6 months', value: 180 }
  ];

  const fetchDashboardData = async (districtValue) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = { days: timeRange, district: districtValue, disease };
      const response = await fetch(
        'https://diseases-backend.onrender.com/api/v1/user/dashboard/disease-records',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data for selected district
    fetchDashboardData(district).then(data => {
      if (data) setDashboardData(data);
    });
    // Fetch data for all districts (empty district string)
    fetchDashboardData('').then(data => {
      if (data) setAllDistrictData(data);
    });
  }, [timeRange, district, disease]);

  const { monthlyDiseaseData, districtChartData } = transformDataForCharts(allDistrictData || dashboardData, timeRange);

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Month,Cases,Active,Recoveries\n"
      + monthlyDiseaseData.map(row => `${row.name},${row.cases},${row.active},${row.recoveries}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "disease_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {/* Centered Loading Overlay */}
      {isLoading && (
  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white/40 backdrop-blur-3xl z-50">
    <div className="flex-col relative flex justify-center items-center">
      <Lottie 
        animationData={loadingAnimation} 
        loop={true} 
        className="w-60 h-60"
      />
      <h1 className="text-xl font-semibold text-gray-900 mt-2">Loading... Please wait</h1>
    </div>
  </div>
)}
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Disease Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Real-time monitoring for {district} (
            {timeRanges.find(r => r.value === timeRange)?.label})
          </p>
        </div>
        <div className="flex space-x-4 items-center">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg shadow-md hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-opacity-50 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value} className="bg-white text-gray-900">
                {range.label}
              </option>
            ))}
          </select>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg shadow-md hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-opacity-50 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {districts.map((dist) => (
              <option key={dist} value={dist} className="bg-white text-gray-900">{dist}</option>
            ))}
          </select>
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Thermometer}
            title="Total Cases"
            value={dashboardData?.stats?.total_cases?.toLocaleString() || '0'}
            color="red"
          />
          <StatCard
            icon={Users}
            title="Active Cases"
            value={dashboardData?.stats?.active_cases?.toLocaleString() || '0'}
            color="purple"
          />
          <StatCard
            icon={Activity}
            title="Recovery Rate"
            value={dashboardData?.stats?.recovery_rate || '0%'}
            color="green"
          />
          <StatCard
            icon={AlertTriangle}
            title="Mortality Rate"
            value={dashboardData?.stats?.mortality_rate || '0%'}
            color="yellow"
          />
        </div>
      )}

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disease Trend Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Disease Trend Analysis (
              {timeRanges.find(r => r.value === timeRange)?.label})
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 rounded-md ${chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 rounded-md ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Bar
              </button>
            </div>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={monthlyDiseaseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="cases" stroke="#3B82F6" strokeWidth={2} name="Cases" />
                  <Line type="monotone" dataKey="recoveries" stroke="#10B981" strokeWidth={2} name="Recoveries" />
                  <Line type="monotone" dataKey="active" stroke="#EF4444" strokeWidth={2} name="Active" />
                </LineChart>
              ) : (
                <BarChart data={monthlyDiseaseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="cases" fill="#3B82F6" name="Cases" />
                  <Bar dataKey="recoveries" fill="#10B981" name="Recoveries" />
                  <Bar dataKey="active" fill="#EF4444" name="Active" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* District-wise Distribution */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            District-wise Distribution (
            {timeRanges.find((r) => r.value === timeRange)?.label || "Unknown"})
          </h2>
          {districtChartData.length > 0 ? (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={districtChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {districtChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<DistrictTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <DataNotAvailable message="District data not available" />
          )}
        </section>
      </div>

      {/* Alerts Section */}
      {dashboardData?.outbreakAlerts?.length > 0 && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Outbreak Alerts</h3>
          <ul className="space-y-4">
            {dashboardData.outbreakAlerts.map((alert, index) => (
              <li key={index} className="flex items-center text-sm">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                <span>
                  {alert.disease} outbreak in {alert.district} - {alert.cases} cases on{' '}
                  {new Date(alert.date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;