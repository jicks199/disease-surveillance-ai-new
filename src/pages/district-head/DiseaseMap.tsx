import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; // Removed GeoJSON since we’re focusing on a single district
import { AlertTriangle } from "lucide-react";
import { useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";

const DiseaseMap = () => {
  const { email, role, district } = useSelector((state) => state.auth);
  const [selectedDayRange, setSelectedDayRange] = useState(7);
  const [mapData, setMapData] = useState(null);
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

  const dayRanges = [
    { label: "Last 7 Days", value: 7 },
    { label: "Last 1 Month", value: 30 },
    { label: "Last 3 Months", value: 90 },
    { label: "Last 6 Months", value: 180 },
    { label: "Last 1 Year", value: 365 },
  ];

  // Fetch data from API for the specific district
  const fetchMapData = async (days) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = { email, role, district, days }; // Include district in payload
      const response = await fetch(
        `${
          import.meta.env.VITE_API_VERCEL
        }/api/v1/district-head/dashboard/disease-records`, // Updated to district-head endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch map data");
      }

      const data = await response.json();
      
      // Filter districtData to match the user's district
      const districtInfo = data.districtData.find(
        (d) => d._id.toLowerCase() === district.toLowerCase()
      );

      if (!districtInfo) {
        throw new Error(`No data found for district: ${district}`);
      }

      setMapData({
        ...data,
        districtData: [districtInfo], // Only keep the user's district
      });
    } catch (err) {
      console.error("Error fetching map data:", err);
      setError(err.message || "Failed to load map data. Please try again.");
      setMapData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (email && role && district) {
      fetchMapData(selectedDayRange);
    }
  }, [email, role, district, selectedDayRange]);

  // Coordinate mapping for Gujarat districts
  const districtCoordinates = {
    Ahmedabad: [23.0225, 72.5714],
    Amreli: [21.6032, 71.2182],
    Gandhinagar: [23.2156, 72.6369],
    Surat: [21.1702, 72.8311],
    Vadodara: [22.3072, 73.1812],
    Rajkot: [22.3039, 70.8022],
  };

  // Transform API data for the single district marker
  const outbreakData = mapData?.districtData.map((districtItem) => {
    const totalCases = districtItem.total_cases;
    const type =
      totalCases > 10000 ? "critical" : totalCases > 100 ? "moderate" : "safe"; // Adjusted based on your sample (162 = moderate)

    return {
      position: districtCoordinates[districtItem._id] || [23.0225, 72.5714], // Fallback to Ahmedabad
      type,
      city: districtItem._id,
      diseases: mapData.monthlyData[0]?.diseases || [],
      totalCases,
    };
  }) || [];

  const getColor = (type) => {
    switch (type) {
      case "critical":
        return "text-red-500";
      case "moderate":
        return "text-orange-500";
      case "safe":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  // Legend data for the single district
  const legendData = outbreakData.length > 0 ? {
    critical: outbreakData[0].type === "critical" ? [outbreakData[0].city] : [],
    moderate: outbreakData[0].type === "moderate" ? [outbreakData[0].city] : [],
    safe: outbreakData[0].type === "safe" ? [outbreakData[0].city] : [],
  } : { critical: [], moderate: [], safe: [] };

  return (
    <div className="flex p-6 bg-gray-100 min-h-screen space-x-6">
      {/* Sidebar Legend */}
      <div className="w-1/4 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Outbreak Zone: {district}
        </h2>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Time Range:
          </label>
          <select
            value={selectedDayRange}
            onChange={(e) => setSelectedDayRange(Number(e.target.value))}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {dayRanges.map((range) => (
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
        {isLoading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <ul className="space-y-3">
            <li className="flex items-center">
              <AlertTriangle className="text-red-500 mr-2 h-5 w-5" />
              <span className="text-sm">
                Critical Zone{" "}
                {legendData.critical.length > 0
                  ? `(${legendData.critical[0]})`
                  : "(None)"}
              </span>
            </li>
            <li className="flex items-center">
              <AlertTriangle className="text-orange-500 mr-2 h-5 w-5" />
              <span className="text-sm">
                Moderate Risk{" "}
                {legendData.moderate.length > 0
                  ? `(${legendData.moderate[0]})`
                  : "(None)"}
              </span>
            </li>
            <li className="flex items-center">
              <AlertTriangle className="text-green-500 mr-2 h-5 w-5" />
              <span className="text-sm">
                Safe Zone{" "}
                {legendData.safe.length > 0 ? `(${legendData.safe[0]})` : "(None)"}
              </span>
            </li>
          </ul>
        )}
      </div>

      {/* Map Section */}
      <div className="w-3/4 h-[600px] bg-white rounded-xl shadow-md overflow-hidden">
        <MapContainer
          center={districtCoordinates[district] || [23.0225, 72.5714]} // Center on the district
          zoom={10} // Closer zoom for single district
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Single District Marker */}
          {outbreakData.map((data, idx) => (
            <Marker key={idx} position={data.position}>
              <Popup>
                <div className={`font-bold ${getColor(data.type)}`}>
                  {data.city} - {data.type.toUpperCase()} Zone
                </div>
                <div className="mt-2">
                  <p>Total Cases: {data.totalCases.toLocaleString()}</p>
                  <p className="text-sm font-semibold mt-1">Disease Breakdown:</p>
                  <ul className="text-xs space-y-1">
                    {data.diseases.map((disease, index) => (
                      <li key={index}>
                        {disease.name}: {disease.cases.toLocaleString()} cases
                      </li>
                    ))}
                  </ul>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default DiseaseMap;