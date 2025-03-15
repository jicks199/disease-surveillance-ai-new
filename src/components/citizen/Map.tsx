import React from 'react';
import { MapPin } from 'lucide-react';

// This is a simplified map component. In a real application, 
// you would integrate with a mapping library like Mapbox or Google Maps
const Map = () => {
  const districts = [
    { id: 1, name: 'Ahmedabad', cases: 245, lat: '23.0225', lng: '72.5714' },
    { id: 2, name: 'Surat', cases: 189, lat: '21.1702', lng: '72.8311' },
    { id: 3, name: 'Vadodara', cases: 156, lat: '22.3072', lng: '73.1812' },
    { id: 4, name: 'Rajkot', cases: 134, lat: '22.3039', lng: '70.8022' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Disease Distribution Map</h2>
      <div className="relative h-[600px] bg-gray-100 rounded-lg overflow-hidden">
        <div className="absolute inset-0">
          {/* Placeholder for actual map implementation */}
          <div className="w-full h-full bg-blue-50 p-4">
            {districts.map((district) => (
              <div
                key={district.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${parseInt(district.lng) % 10 * 10}%`,
                  top: `${parseInt(district.lat) % 10 * 10}%`
                }}
              >
                <div className="relative">
                  <MapPin className="h-6 w-6 text-red-500" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="text-sm font-medium">{district.name}</p>
                    <p className="text-xs text-gray-500">{district.cases} cases</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold mb-2">Disease Hotspots</h3>
          {districts.map((district) => (
            <div key={district.id} className="flex items-center justify-between mb-2">
              <span className="text-sm">{district.name}</span>
              <span className="text-sm font-medium text-red-500">{district.cases}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Map;