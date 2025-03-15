import React, { useState } from 'react';
import { MapPin, AlertTriangle } from 'lucide-react';

const SuperAdminMap = () => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const districts = [
    { 
      id: 1, 
      name: 'Ahmedabad', 
      cases: 245, 
      lat: '23.0225', 
      lng: '72.5714',
      riskLevel: 'high',
      details: {
        activeCases: 245,
        recovered: 1200,
        hospitals: 15,
        vaccinated: '68%'
      }
    },
    { 
      id: 2, 
      name: 'Surat', 
      cases: 189, 
      lat: '21.1702', 
      lng: '72.8311',
      riskLevel: 'medium',
      details: {
        activeCases: 189,
        recovered: 890,
        hospitals: 12,
        vaccinated: '72%'
      }
    },
    { 
      id: 3, 
      name: 'Vadodara', 
      cases: 156, 
      lat: '22.3072', 
      lng: '73.1812',
      riskLevel: 'medium',
      details: {
        activeCases: 156,
        recovered: 670,
        hospitals: 8,
        vaccinated: '65%'
      }
    },
    { 
      id: 4, 
      name: 'Rajkot', 
      cases: 134, 
      lat: '22.3039', 
      lng: '70.8022',
      riskLevel: 'low',
      details: {
        activeCases: 134,
        recovered: 450,
        hospitals: 6,
        vaccinated: '70%'
      }
    }
  ];

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
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
                  <span className="font-medium">{selectedDistrict.details.activeCases}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Recovered</span>
                  <span className="font-medium">{selectedDistrict.details.recovered}</span>
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
    </div>
  );
};

export default SuperAdminMap;