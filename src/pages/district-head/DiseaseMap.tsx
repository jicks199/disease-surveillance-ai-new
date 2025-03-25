import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { AlertTriangle } from "lucide-react";
import { useSelector } from "react-redux";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/Loader.json';

const DiseaseMap = () => {
  const { email, role, district } = useSelector((state) => state.auth);
  const [selectedDayRange, setSelectedDayRange] = useState(7);
  const [hotspots, setHotspots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([23.0225, 72.5714]); // Default: Ahmedabad

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

  // District center coordinates (for fallback)
  const districtCoordinates = {
    Ahmedabad: [23.0225, 72.5714],
    Amreli: [21.6032, 71.2182],
    Gandhinagar: [23.2156, 72.6369],
    Surat: [21.1702, 72.8311],
    Vadodara: [22.3072, 73.1812],
    Rajkot: [22.3039, 70.8022],
    // Add more districts as needed
  };

  // Function to fetch coordinates from Nominatim
  const fetchCoordinates = async (hotspotName) => {
    try {
      const query = `${hotspotName}, ${district}, Gujarat, India`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
      return null; // Return null if no coordinates found
    } catch (err) {
      console.error(`Error fetching coordinates for ${hotspotName}:`, err);
      return null;
    }
  };

  // Fetch hotspot data and coordinates
  const fetchHotspotData = async (days) => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch hotspot names from your API
      const payload = { email, role, district, days };
      const response = await fetch(
        "https://diseases-backend.onrender.com/api/v1/district-head/dashboard/hotspots",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch hotspot data");
      }

      const data = await response.json();
      console.log("Hotspot API Response:", data);

      const hotspotList = data.hotspot[0]?.hotspot || [];

      // Fetch coordinates for each hotspot
      const hotspotsWithCoords = [];
      for (const hotspot of hotspotList) {
        const coords = await fetchCoordinates(hotspot);
        hotspotsWithCoords.push({
          name: hotspot,
          lat: coords?.lat,
          lng: coords?.lng,
          cases: 0, // Add cases if API provides this later
        });
        // Respect Nominatim's rate limit (1 req/sec)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setHotspots(hotspotsWithCoords);

      // Set map center dynamically
      if (hotspotsWithCoords.length > 0 && hotspotsWithCoords[0].lat && hotspotsWithCoords[0].lng) {
        setMapCenter([hotspotsWithCoords[0].lat, hotspotsWithCoords[0].lng]);
      } else {
        setMapCenter(districtCoordinates[district] || [23.0225, 72.5714]);
      }
    } catch (err) {
      console.error("Error fetching hotspot data:", err);
      setError(err.message || "Failed to load hotspot data. Please try again.");
      setHotspots([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (email && role && district) {
      fetchHotspotData(selectedDayRange);
    }
  }, [email, role, district, selectedDayRange]);

  // Transform hotspot data for markers
  const hotspotMarkers = hotspots.map((hotspot) => ({
    position: hotspot.lat && hotspot.lng ? [hotspot.lat, hotspot.lng] : districtCoordinates[district] || [23.0225, 72.5714],
    name: hotspot.name,
    type: "hotspot",
    cases: hotspot.cases || 0,
  }));

  // Custom marker icon
  const getColor = (type) => {
    return "#ef4444"; // Red for hotspots
  };

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
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  };

  return (
    <div className="flex p-6 bg-gray-100 min-h-screen space-x-6">
      {/* Sidebar Legend */}
      <div className="w-1/4 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Hotspot Zone: {district}
        </h2>
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          Total Areas: {hotspots.length}
        </h3>
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
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <ul className="space-y-3">
            <li className="flex items-center">
              <AlertTriangle className="text-red-500 mr-2 h-5 w-5" />
              <span className="text-sm">
                Affected Areas: {hotspots.length}
              </span>
            </li>
          </ul>
        )}
      </div>

      {/* Map Section */}
      <div className="w-3/4 h-[600px] bg-white rounded-xl shadow-md overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={11}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Hotspot Markers */}
          {hotspotMarkers.map((data, idx) => (
            <Marker
              key={idx}
              position={data.position}
              icon={createMarkerIcon(data.type)}
            >
              <Popup>
                <div style={{ color: getColor(data.type) }} className="font-bold">
                  {data.name} - Hotspot
                </div>
                <div className="mt-2">
                  <p>Cases: {data.cases.toLocaleString()}</p>
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