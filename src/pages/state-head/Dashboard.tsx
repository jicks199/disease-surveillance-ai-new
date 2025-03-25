import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AdminTrends from "../../components/state-head/SuperAdminTrends"; // Assuming this is SuperAdminTrends
import SuperAlerts from "../../components/state-head/SuperOutbreakAlerts";
import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/Loader.json';
import {
  Activity,
  Users,
  AlertTriangle,
  Guitar as Hospital,
  Users as AgeIcon,
} from "lucide-react";

const StatCard = ({
  icon: Icon,
  title,
  value,
  change,
  color = "bg-gray-100",
}) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center">
      <div className={`p-3 ${color} rounded-lg`}>
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">
          {value === "N/A" ? "0" : value}
        </p>
        <p
          className={`text-sm pt-3 mt-1 ${
            isNaN(parseFloat(change)) || change === "N/A"
              ? "text-gray-500"
              : parseFloat(change) >= 0
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {isNaN(parseFloat(change)) || change === "N/A"
            ? "0 from last month"
            : `${change}% from last month`}
        </p>
      </div>
    </div>
  </div>
);

const GenderDistributionCard = ({ male, female }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
    <h3 className="text-sm font-medium text-gray-500">Gender Distribution</h3>
    <div className="flex justify-between mt-2">
      <div className="text-center">
        <p className="text-2xl font-semibold text-blue-600">{male || "50%"}</p>
        <p className="text-sm text-gray-500">Male</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-semibold text-pink-600">
          {female || "50%"}
        </p>
        <p className="text-sm text-gray-500">Female</p>
      </div>
    </div>
  </div>
);

const AgeRatioCard = ({ ageRange, cases }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center">
      <div className="p-3 bg-teal-50 rounded-lg">
        <AgeIcon className="h-6 w-6 text-teal-600" />
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">
          Dominant Age Group
        </h3>
        <p className="text-2xl font-semibold text-gray-900">
          {ageRange || "N/A"}
        </p>
        <p className="text-sm text-gray-600">
          {cases ? `${cases.toLocaleString()} cases` : "No data"}
        </p>
      </div>
    </div>
  </div>
);

// Component for displaying "Data Not Available" message
const DataNotAvailable = ({ message }) => (
  <div className="flex items-center justify-center h-80">
    <p className="text-gray-500 text-lg">{message}</p>
  </div>
);

const Dashboard = () => {
  const { email, role } = useSelector((state) => state.auth);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDisease, setSelectedDisease] = useState("");
  const [selectedDays, setSelectedDays] = useState(7);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const districts = [
    "Ahmedabad",
    "Amreli",
    "Anand",
    "Aravalli",
    "Banaskantha",
    "Bharuch",
    "Bhavnagar",
    "Botad",
    "Chhota Udaipur",
    "Dahod",
    "Dang",
    "Devbhoomi Dwarka", 
    "Gandhinagar",
    "Gir Somnath",
    "Jamnagar",
    "Junagadh",
    "Kheda",
    "Kutch",
    "Mahisagar",
    "Mehsana",
    "Morbi",
    "Narmada",
    "Navsari",
    "Panchmahal",
    "Patan",
    "Porbandar",
    "Rajkot",
    "Sabarkantha",
    "Surat",
    "Surendranagar",
    "Tapi",
    "Vadodara",
    "Valsad",
  ];

  const diseases = [
    "Malaria",
    "Dengue",
    "COVID-19",
    "Cholera",
    "Pneumonia",
    "Typhoid",
    "Swine Flu",
    "Jaundice",
  ];
  const timeRanges = [
    { label: "Last 7 days", value: 7 },
    { label: "Last 3 months", value: 90 },
    { label: "Last 6 months", value: 180 },
    { label: "Last 1 year", value: 365 },
  ];

  const fetchDashboardData = async (initial = false) => {
    setIsLoading(true);
    try {
      const payload = initial
        ? { email, role }
        : {
            email,
            role,
            days: selectedDays,
            district: selectedDistrict || "",
            disease: selectedDisease || "",
          };

      const response = await fetch(
        `${
          import.meta.env.VITE_API_VERCEL
        }/api/v1/state-head/dashboard/disease-records`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();
      console.log("API Response:", data);
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setDashboardData(null); // Reset data on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (email && role) {
      fetchDashboardData(true); // Initial fetch with email and role only
    }
  }, [email, role]);

  useEffect(() => {
    if (
      email &&
      role &&
      (selectedDistrict || selectedDisease || selectedDays !== 7)
    ) {
      fetchDashboardData(false); // Fetch with filters
    }
  }, [selectedDistrict, selectedDisease, selectedDays]);

  const stats = dashboardData?.stats || {};

  return (
    <div className="relative min-h-screen p-6">
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

      {/* Main Dashboard Content */}
      <div
        className={`space-y-6 transition-all duration-300 ${
          isLoading ? "blur-md pointer-events-none select-none" : ""
        }`}
      >
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold text-gray-900">
            Gujarat Head Dashboard
          </h1>
          <div className="flex space-x-9">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                {/* District Select */}
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  <option value="" className="bg-white text-gray-900">
                    All Districts
                  </option>
                  {districts.map((district) => (
                    <option
                      key={district}
                      value={district}
                      className="bg-white text-gray-900"
                    >
                      {district}
                    </option>
                  ))}
                </select>

                {/* Disease Select */}
                <select
                  value={selectedDisease}
                  onChange={(e) => setSelectedDisease(e.target.value)}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg shadow-md hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-opacity-50 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  <option value="" className="bg-white text-gray-900">
                    All Diseases
                  </option>
                  {diseases.map((disease) => (
                    <option
                      key={disease}
                      value={disease}
                      className="bg-white text-gray-900"
                    >
                      {disease}
                    </option>
                  ))}
                </select>

                {/* Days Select */}
                <select
                  value={selectedDays}
                  onChange={(e) => setSelectedDays(Number(e.target.value))}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {timeRanges.map((range) => (
                    <option
                      key={range.value}
                      value={range.value}
                      className="bg-white text-gray-900"
                    >
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {dashboardData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard
              icon={Activity}
              title="Total Cases"
              value={stats.total_cases?.toLocaleString() || "0"}
              change={stats.total_month_cases || "0"}
              color="bg-indigo-50"
            />
            <StatCard
              icon={Users}
              title="Active Cases"
              value={stats.active_cases?.toLocaleString() || "0"}
              change={stats.total_month_active_cases || "0"}
              color="bg-green-50"
            />
            <StatCard
              icon={AlertTriangle}
              title="Recovery Rate"
              value={stats.recovery_rate ? `${stats.recovery_rate}%` : "0%"}
              change={stats.total_month_recovered_rate || "0"}
              color="bg-yellow-50"
            />
            <StatCard
              icon={Hospital}
              title="Mortality Rate"
              value={stats.mortality_rate ? `${stats.mortality_rate}%` : "0%"}
              change={stats.total_month_mortality_rate || "0"}
              color="bg-purple-50"
            />
            <GenderDistributionCard
              male={stats.total_male ? `${stats.total_male}%` : "50%"}
              female={stats.total_female ? `${stats.total_female}%` : "50%"}
            />
            <AgeRatioCard
              ageRange={stats.max_age_group?.age_range}
              cases={stats.max_age_group?.cases}
            />
          </div>

          {/* Check if district or disease data is available */}
          {dashboardData.districtData?.length > 0 ||
          dashboardData.monthlyData?.[0]?.diseases?.length > 0 ? (
            <div>
              <AdminTrends data={dashboardData} days={selectedDays} />
            </div>
          ) : (
            <DataNotAvailable
              message={
                selectedDistrict && selectedDisease
                  ? "Data not available for selected district and disease"
                  : selectedDistrict
                  ? "Data not available for selected district"
                  : selectedDisease
                  ? "Data not available for selected disease"
                  : "No data available"
              }
            />
          )}
        </>
      ) : (
        !isLoading && (
          <DataNotAvailable
            message={
              selectedDistrict && selectedDisease
                ? "Data not available for selected district and disease"
                : selectedDistrict
                ? "Data not available for selected district"
                : selectedDisease
                ? "Data not available for selected disease"
                : "No data available"
            }
          />
        )
      )}
    </div>
  );
};

export default Dashboard;
