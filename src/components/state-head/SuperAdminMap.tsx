import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MapPin, AlertTriangle } from "lucide-react";

const SuperAdminMap = ({ days = 7 }) => { // Added days prop to sync with Dashboard
  const { email, role } = useSelector((state) => state.auth);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  const fetchDistrictData = async () => {
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
      const totalCasesOverall = data.stats.total_cases;
      const recoveryRate = parseFloat(data.stats.recovery_rate) / 100;

      // Transform districtData into expected structure
      const transformedDistricts = data.districtData.map((district, index) => {
        const totalCases = district.total_cases;
        const activeCases = Math.round(totalCases * (1 - recoveryRate)); // Estimate active cases
        const recovered = Math.round(totalCases * recoveryRate); // Estimate recovered

        return {
          id: index + 1,
          name: district._id,
          cases: totalCases,
          lat: getLat(district._id), // Placeholder for coordinates
          lng: getLng(district._id), // Placeholder for coordinates
          riskLevel: getRiskLevel(totalCases),
          details: {
            activeCases,
            recovered,
            hospitals: Math.floor(totalCases / 10000) + 5, // Placeholder: rough estimate
            vaccinated: `${Math.floor((Math.random() * 20) + 60)}%`, // Placeholder
          },
        };
      });

      setDistricts(transformedDistricts);
    } catch (err) {
      console.error("Error fetching district data:", err);
      setError("Failed to load district data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder functions for coordinates (API doesn’t provide lat/lng)
  const getLat = (districtName: string) => {
    const staticCoords = {
      Ahmedabad: "23.0225",
      Gandhinagar: "23.2156",
      Amreli: "21.6032",
      Surat: "21.1702",
      Vadodara: "22.3072",
      Rajkot: "22.3039",
    };
    return staticCoords[districtName] || `${Math.random() * 5 + 20}`; // Random fallback
  };

  const getLng = (districtName: string) => {
    const staticCoords = {
      Ahmedabad: "72.5714",
      Gandhinagar: "72.6369",
      Amreli: "71.2115",
      Surat: "72.8311",
      Vadodara: "73.1812",
      Rajkot: "70.8022",
    };
    return staticCoords[districtName] || `${Math.random() * 5 + 70}`; // Random fallback
  };

  // Determine risk level based on cases
  const getRiskLevel = (cases: number) => {
    if (cases > 10000) return "high"; // Adjusted for larger API numbers
    if (cases > 100) return "medium";
    return "low";
  };

  // Fetch data on mount and when days changes
  useEffect(() => {
    if (email && role) {
      fetchDistrictData();
    }
  }, [email, role, days]);

  const getRiskColor = (riskLevel: string) => {
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
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Interactive Disease Map</h2>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Export Data
          </button>
          <select className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500">
            <option>All Diseases</option>
            <option>Malaria</option>
            <option>Dengue</option>
            <option>COVID-19</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading map data...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="relative h-[600px] bg-gray-100 rounded-lg overflow-hidden">
              <div className="absolute inset-0">
                <div className="w-full h-full bg-blue-50 p-4">
                  {districts.map((district) => (
                    <div
                      key={district.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      style={{
                        left: `${parseInt(district.lng) % 10 * 10}%`,
                        top: `${parseInt(district.lat) % 10 * 10}%`,
                      }}
                      onClick={() => setSelectedDistrict(district)}
                    >
                      <div className="relative">
                        <MapPin className={`h-6 w-6 ${getRiskColor(district.riskLevel)}`} />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <p className="text-sm font-medium">{district.name}</p>
                          <p className="text-xs text-gray-500">{district.cases} cases</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {selectedDistrict ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">{selectedDistrict.name} District</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Cases</span>
                    <span className="font-medium">{selectedDistrict.details.activeCases.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Recovered</span>
                    <span className="font-medium">{selectedDistrict.details.recovered.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Hospitals</span>
                    <span className="font-medium">{selectedDistrict.details.hospitals}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Vaccinated</span>
                    <span className="font-medium">{selectedDistrict.details.vaccinated}</span>
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
                <p className="text-gray-500">Select a district to view details</p>
              </div>
            )}

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Risk Levels</h3>
              <div className="space-y-2">
                {districts.map((district) => (
                  <div key={district.id} className="flex items-center justify-between">
                    <span className="text-sm">{district.name}</span>
                    <div className="flex items-center">
                      <AlertTriangle className={`h-4 w-4 ${getRiskColor(district.riskLevel)} mr-2`} />
                      <span className="text-sm capitalize">{district.riskLevel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminMap;