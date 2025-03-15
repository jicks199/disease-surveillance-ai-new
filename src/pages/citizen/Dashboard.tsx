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
  Bar
} from 'recharts';
import {
  MapPin,
  Thermometer,
  Users,
  Activity,
  AlertTriangle,
  TrendingUp,
  Download,
  Calendar,
  MessageSquare
} from 'lucide-react';
import io from 'socket.io-client';

const socket = io('http://127.0.0.1:5000');

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: number | string;
  change: number;
  color?: string;
}

const initialData = [
  { name: 'Jan', cases: 400, recoveries: 240, active: 160 },
  { name: 'Feb', cases: 300, recoveries: 200, active: 100 },
  { name: 'Mar', cases: 600, recoveries: 400, active: 200 },
  { name: 'Apr', cases: 800, recoveries: 600, active: 200 },
  { name: 'May', cases: 500, recoveries: 450, active: 50 },
  { name: 'Jun', cases: 650, recoveries: 500, active: 150 },
];

const genderStats = {
  male: 54,
  female: 46
};

const ageGroupStats = [
  { ageRange: "0-18 years", percentage: 15 },
  { ageRange: "19-40 years", percentage: 45 },
  { ageRange: "41-60 years", percentage: 30 },
  { ageRange: "60+ years", percentage: 10 }
];

const mostAffectedAgeGroup = ageGroupStats.reduce((max, group) =>
  group.percentage > max.percentage ? group : max
);

const StatCard = ({ icon: Icon, title, value, change, color = 'blue' }: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center">
      <div className={`p-3 bg-${color}-50 rounded-lg`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
          {change >= 0 ? '+' : ''}{change}%
          <TrendingUp className="h-4 w-4 ml-1" />
          <span className="ml-1">from last month</span>
        </p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('Last 30 days');
  const [chartType, setChartType] = useState('line');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Handle SocketIO alerts
  useEffect(() => {
    socket.on('connect', () => console.log('Connected to SocketIO'));
    socket.on('alert', (data: { message: string }) => {
      console.log('Alert received:', data.message);
      setAlertMessage(data.message);
      setIsChatbotOpen(true);
      setTimeout(() => {
        setIsChatbotOpen(false);
        setAlertMessage(null);
      }, 10000); // Changed to 10 seconds
    });
    return () => {
      socket.off('alert');
      socket.off('connect');
    };
  }, []);

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + Object.keys(initialData[0]).join(",") + "\n"
      + initialData.map(row => Object.values(row).join(",")).join("\n");
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
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Disease Surveillance Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring and analytics</p>
        </div>
        <div className="flex space-x-4 items-center">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 appearance-none"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last 6 months</option>
            </select>
          </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard icon={MapPin} title="Active Hotspots" value="12" change={5} color="blue" />
        <StatCard icon={Thermometer} title="New Cases" value="234" change={-2} color="red" />
        <StatCard icon={Users} title="Total Affected" value="1,234" change={8} color="purple" />
        <StatCard icon={Activity} title="Recovery Rate" value="94%" change={3} color="green" />
        <StatCard icon={AlertTriangle} title="Risk Level" value="Moderate" change={2} color="yellow" />

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-sm font-medium text-gray-500">Gender Distribution</h3>
          <div className="flex justify-between mt-2">
            <div className="text-center">
              <p className="text-2xl font-semibold text-blue-600">54%</p>
              <p className="text-sm text-gray-500">Male</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-pink-600">46%</p>
              <p className="text-sm text-gray-500">Female</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-sm font-medium text-gray-500">Most Affected Age Group</h3>
          <div className="mt-2">
            <p className="text-2xl font-semibold text-gray-900">19-40 years</p>
            <p className="text-sm text-gray-500">45% of cases</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Disease Trend Analysis</h2>
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
              <LineChart data={initialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Line type="monotone" dataKey="cases" stroke="#3B82F6" strokeWidth={2} name="Cases" />
                <Line type="monotone" dataKey="recoveries" stroke="#10B981" strokeWidth={2} name="Recoveries" />
                <Line type="monotone" dataKey="active" stroke="#EF4444" strokeWidth={2} name="Active" />
              </LineChart>
            ) : (
              <BarChart data={initialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Bar dataKey="cases" fill="#3B82F6" name="Cases" />
                <Bar dataKey="recoveries" fill="#10B981" name="Recoveries" />
                <Bar dataKey="active" fill="#EF4444" name="Active" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
          <ul className="space-y-4">
            <li className="flex items-center text-sm">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              <span>New cluster detected in Region A - 45 cases</span>
            </li>
            <li className="flex items-center text-sm">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <span>Rising trend in Region B - 15% increase</span>
            </li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Avg. Daily Cases</p>
              <p className="font-semibold">45</p>
            </div>
            <div>
              <p className="text-gray-600">Peak Month</p>
              <p className="font-semibold">April</p>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Dashboard;