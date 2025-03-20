import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import { AlertTriangle } from "lucide-react";
import { useSelector } from "react-redux";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import gujaratGeoJSON from "./gujarat.geo.json"; // Your Gujarat GeoJSON file

const DiseaseMap = () => {
  const { email, role } = useSelector((state) => state.auth);
  const [selectedDayRange, setSelectedDayRange] = useState(7);
  const [mapData, setMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dayRanges = [
    { label: "Last 7 Days", value: 7 },
    { label: "Last 1 Month", value: 30 },
    { label: "Last 3 Months", value: 90 },
    { label: "Last 6 Months", value: 180 },
    { label: "Last 1 Year", value: 365 },
  ];

  // Fetch data from API
  const fetchMapData = async (days) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = { email, role, days };
      const response = await fetch(
        `${import.meta.env.VITE_API_VERCEL}/api/v1/state-head/dashboard/disease-records`,
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
      console.log("API Response Data:", data);
      setMapData(data);
    } catch (err) {
      console.error("Error fetching map data:", err);
      setError("Failed to load map data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (email && role) {
      fetchMapData(selectedDayRange);
    }
  }, [email, role, selectedDayRange]);

  // Coordinate mapping for Gujarat districts (for markers)
  const districtCoordinates = {
    Ahmedabad: [23.0225, 72.2714],
    Amreli: [21.6032, 71.2182],
    Anand: [22.5645, 72.9289],
    Aravalli: [23.3985, 73.2581],
    Banaskantha: [24.1740, 72.4319],
    Bharuch: [21.7051, 72.9959],
    Bhavnagar: [21.7645, 72.1519],
    Botad: [22.1718, 71.6684],
    "Chhota Udaipur": [22.3185, 74.0130],
    Dahod: [22.8350, 74.2599],
    Dang: [20.7537, 73.6860],
    "Devbhoomi Dwarka": [22.2026, 69.6578],
    Gandhinagar: [23.2156, 72.6369],
    "Gir Somnath": [20.9100, 70.3670],
    Jamnagar: [22.4707, 70.0577],
    Junagadh: [21.5222, 70.4579],
    Kheda: [22.7507, 72.6847],
    Kutch: [23.7337, 69.8597],
    Mahisagar: [23.1319, 73.6158],
    Mehsana: [23.5870, 72.3693],
    Morbi: [22.8173, 70.8377],
    Narmada: [21.8713, 73.5036],
    Navsari: [20.9467, 72.9520],
    Panchmahal: [22.7688, 73.6266],
    Patan: [23.8493, 72.1266],
    Porbandar: [21.6417, 69.6293],
    Rajkot: [22.3039, 70.8022],
    Sabarkantha: [23.5628, 72.9570],
    Surat: [21.1702, 72.8311],
    Surendranagar: [22.7201, 71.6495],
    Tapi: [21.1155, 73.3949],
    Vadodara: [22.3072, 73.1812],
    Valsad: [20.5992, 72.9342],
  };

  // Remove duplicates and transform API data for map markers
  const outbreakData = Array.from(
    new Map(
      (mapData?.districtData || []).map((district) => {
        const totalCases = district.total_cases;
        const type =
          totalCases > 10000 ? "critical" : totalCases > 500 ? "moderate" : "safe";
        const districtName = district._id;
        const position = districtCoordinates[districtName] || [22.2587, 71.1924];

        console.log(`District: ${districtName}, Coordinates: ${position}, Type: ${type}`);

        return [
          districtName,
          {
            position,
            type,
            city: districtName,
            diseases: mapData.monthlyData[0]?.diseases || [],
            totalCases,
          },
        ];
      })
    ).values()
  );

  const getColor = (type) => {
    switch (type) {
      case "critical":
        return "#ef4444"; // Red
      case "moderate":
        return "#f97316"; // Orange
      case "safe":
        return "#22c55e"; // Green
      default:
        return "transparent"; // No fill for districts without data
    }
  };

  // Style function for GeoJSON districts
  const getDistrictStyle = (feature) => {
    const districtName = feature.properties.district;
    const districtData = outbreakData.find((d) => d.city === districtName);
    const type = districtData ? districtData.type : "default";

    return {
      fillColor: getColor(type),
      weight: 1, // Thinner border for clarity
      opacity: 0.8,
      color: "#1565C0", // Blue border for Gujarat districts
      fillOpacity: districtData ? 0.6 : 0, // Highlight only districts with data
    };
  };

  // Custom marker icon
  const createMarkerIcon = (type) => {
    const color = getColor(type);
    return L.divIcon({
      html: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
          <circle cx="12" cy="12" r="4" fill="white"/>
        </svg>
      `,
      className: "custom-marker",
      iconSize: [24, 24],
      iconAnchor: [12, 12], // Center the circle
      popupAnchor: [0, -12], // Popup above the marker
    });
  };

  // Legend data
  const legendData = {
    critical: outbreakData.filter((d) => d.type === "critical").map((d) => d.city),
    moderate: outbreakData.filter((d) => d.type === "moderate").map((d) => d.city),
    safe: outbreakData.filter((d) => d.type === "safe").map((d) => d.city),
  };

  return (
    <div className="flex p-6 bg-gray-100 min-h-screen space-x-6">
      {/* Sidebar Legend */}
      <div className="w-1/4 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Outbreak Zones</h2>
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
              <option key={range.value} value={range.value} className="bg-white text-gray-900">
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
                Critical Zones{" "}
                {legendData.critical.length > 0
                  ? `(${legendData.critical.join(", ")})`
                  : "(None)"}
              </span>
            </li>
            <li className="flex items-center">
              <AlertTriangle className="text-orange-500 mr-2 h-5 w-5" />
              <span className="text-sm">
                Moderate Risk Areas{" "}
                {legendData.moderate.length > 0
                  ? `(${legendData.moderate.join(", ")})`
                  : "(None)"}
              </span>
            </li>
            <li className="flex items-center">
              <AlertTriangle className="text-green-500 mr-2 h-5 w-5" />
              <span className="text-sm">
                Safe Zones{" "}
                {legendData.safe.length > 0 ? `(${legendData.safe.join(", ")})` : "(None)"}
              </span>
            </li>
          </ul>
        )}
      </div>

      {/* Map Section */}
      <div className="w-3/4 h-[600px] bg-white rounded-xl shadow-md overflow-hidden">
        <MapContainer
          center={[22.2587, 71.1924]}
          zoom={7}
          className="h-full w-full"
          whenCreated={(map) => {
            const bounds = L.latLngBounds(outbreakData.map((d) => d.position));
            map.fitBounds(bounds);
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            opacity={1} // Full opacity for clear base map
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <GeoJSON
            data={gujaratGeoJSON}
            style={getDistrictStyle}
            onEachFeature={(feature, layer) => {
              const districtName = feature.properties.district;
              const districtData = outbreakData.find((d) => d.city === districtName);
              if (districtData) {
                layer.bindPopup(
                  `<div style="color: ${getColor(districtData.type)}" class="font-bold">
                    ${districtName} - ${districtData.type.toUpperCase()} Zone
                  </div>`
                );
              }
            }}
          />

          {/* Outbreak Data Markers */}
          {outbreakData.map((data, idx) => (
            <Marker
              key={`${data.city}-${idx}`}
              position={data.position}
              icon={createMarkerIcon(data.type)}
            >
              <Popup>
                <div style={{ color: getColor(data.type) }} className="font-bold">
                  {data.city} - {data.type.toUpperCase()} Zone
                </div>
                <div className="mt-2">
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