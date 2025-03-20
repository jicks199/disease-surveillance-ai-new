import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MapPin, AlertTriangle } from "lucide-react";

const AdminMap = ({ days = 7 }) => {
  const { email, role, district } = useSelector((state) => state.auth);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [districtData, setDistrictData] = useState(null); // Single district object instead of array
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is authenticated and has a district
  if (!email || !role || !district) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          {district
            ? "Please log in to view the map."
            : "Access Denied: No district assigned."}
        </p>
      </div>
    );
  }

  // Fetch data from API
  const fetchDistrictData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = { email, role, district, days };
      const response = await fetch(
        `${
          import.meta.env.VITE_API_VERCEL
        }/api/v1/district-head/dashboard/disease-records`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch district data");
      }

      const data = await response.json();
      const recoveryRate = parseFloat(data.stats.recovery_rate) / 100;

      // Find the specific district data matching the user's district
      const districtInfo = data.districtData.find(
        (d) => d._id.toLowerCase() === district.toLowerCase()
      );

      if (!districtInfo) {
        throw new Error(`No data found for district: ${district}`);
      }

      const totalCases = districtInfo.total_cases;
      const activeCases = Math.round(totalCases * (1 - recoveryRate));
      const recovered = Math.round(totalCases * recoveryRate);

      const transformedDistrict = {
        id: 1, // Single district, so ID is fixed
        name: districtInfo._id,
        cases: totalCases,
        lat: getLat(districtInfo._id),
        lng: getLng(districtInfo._id),
        riskLevel: getRiskLevel(totalCases),
        details: {
          activeCases,
          recovered,
          hospitals: Math.floor(totalCases / 10000) + 5, // Placeholder (API doesn’t provide this)
          vaccinated: `${Math.floor(Math.random() * 20 + 60)}%`, // Placeholder (API doesn’t provide this)
        },
      };

      setDistrictData(transformedDistrict);
      setSelectedDistrict(transformedDistrict); // Auto-select the district
    } catch (err) {
      console.error("Error fetching district data:", err);
      setError(err.message || "Failed to load district data. Please try again.");
      setDistrictData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder functions for coordinates
  const getLat = (districtName) => {
    const staticCoords = {
      Ahmedabad: "23.0225",
      Gandhinagar: "23.2156",
      Amreli: "21.6032",
      Surat: "21.1702",
      Vadodara: "22.3072",
      Rajkot: "22.3039",
    };
    return staticCoords[districtName] || "23.0225"; // Default to Ahmedabad if unknown
  };

  const getLng = (districtName) => {
    const staticCoords = {
      Ahmedabad: "72.5714",
      Gandhinagar: "72.6369",
      Amreli: "71.2115",
      Surat: "72.8311",
      Vadodara: "73.1812",
      Rajkot: "70.8022",
    };
    return staticCoords[districtName] || "72.5714"; // Default to Ahmedabad if unknown
  };

  // Determine risk level based on cases
  const getRiskLevel = (cases) => {
    if (cases > 10000) return "high";
    if (cases > 100) return "medium";
    return "low";
  };

  // Fetch data on mount and when days changes
  useEffect(() => {
    if (email && role && district) {
      fetchDistrictData();
    }
  }, [email, role, district, days]);

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-start justify-center bg-gray-900 bg-opacity-50 z-50 backdrop-blur-sm">
          <div className="mt-80">
            <button className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-full shadow-lg hover:scale-105 transition-transform duration-300">
              <svg className="animate-spin h-6 w-6 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Loading...
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Disease Map for {district}
        </h2>
        <div className="flex items-center space-x-4">
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            disabled={isLoading}
          >
            Export Data
          </button>
          <select
            className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
            disabled={isLoading}
          >
            <option>All Diseases</option>
            <option>Malaria</option>
            <option>Dengue</option>
            <option>COVID-19</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : !districtData ? (
        <div className="text-center py-8 text-gray-500">
          No data available for {district}.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="relative h-[600px] bg-gray-100 rounded-lg overflow-hidden">
              <div className="absolute inset-0">
                <div className="w-full h-full bg-blue-50 p-4">
                  <div
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{
                      left: "50%", // Center the single pin
                      top: "50%",
                    }}
                    onClick={() => setSelectedDistrict(districtData)}
                  >
                    <div className="relative">
                      <MapPin
                        className={`h-8 w-8 ${getRiskColor(districtData.riskLevel)}`}
                      />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <p className="text-sm font-medium">{districtData.name}</p>
                        <p className="text-xs text-gray-500">
                          {districtData.cases.toLocaleString()} cases
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {selectedDistrict ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">
                  {selectedDistrict.name} District
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Cases</span>
                    <span className="font-medium">
                      {selectedDistrict.details.activeCases.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Recovered</span>
                    <span className="font-medium">
                      {selectedDistrict.details.recovered.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Hospitals</span>
                    <span className="font-medium">
                      {selectedDistrict.details.hospitals}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Vaccinated</span>
                    <span className="font-medium">
                      {selectedDistrict.details.vaccinated}
                    </span>
                  </div>
                  <div className="mt-4">
                    <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      View Detailed Report
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-center h-full">
                <p className="text-gray-500">District data loaded</p>
              </div>
            )}

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Risk Level</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{districtData.name}</span>
                  <div className="flex items-center">
                    <AlertTriangle
                      className={`h-4 w-4 ${getRiskColor(districtData.riskLevel)} mr-2`}
                    />
                    <span className="text-sm capitalize">
                      {districtData.riskLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMap;