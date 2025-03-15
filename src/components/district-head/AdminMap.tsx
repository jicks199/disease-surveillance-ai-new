import React, { useState } from 'react';
import { MapPin, AlertTriangle } from 'lucide-react';

const AdminMap = () => {
  const [selectedSector, setSelectedSector] = useState(null);

  // Only Gandhinagar district with sector-wise selection
  const gandhinagar = {
    id: 5,
    name: 'Gandhinagar',
    sectors: [
      {
        sectorName: 'Sector 1',
        cases: 50,
        lat: '23.2156',
        lng: '72.6369',
        riskLevel: 'medium',
        details: {
          activeCases: 50,
          recovered: 200,
          hospitals: 5,
          vaccinated: '75%',
        },
      },
      {
        sectorName: 'Sector 7',
        cases: 30,
        lat: '23.2234',
        lng: '72.6412',
        riskLevel: 'low',
        details: {
          activeCases: 30,
          recovered: 150,
          hospitals: 3,
          vaccinated: '80%',
        },
      },
      {
        sectorName: 'Sector 21',
        cases: 45,
        lat: '23.2398',
        lng: '72.6543',
        riskLevel: 'high',
        details: {
          activeCases: 45,
          recovered: 180,
          hospitals: 7,
          vaccinated: '70%',
        },
      },
    ],
  };

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
        <h2 className="text-xl font-semibold text-gray-900">Gandhinagar - Sector-wise Map</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Export Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2">
          <div className="relative h-[500px] bg-gray-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0">
              {/* Map Placeholder */}
              <div className="w-full h-full bg-blue-50 p-4">
                {gandhinagar.sectors.map((sector) => (
                  <div
                    key={sector.sectorName}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{
                      left: `${parseFloat(sector.lng) % 10 * 10}%`,
                      top: `${parseFloat(sector.lat) % 10 * 10}%`,
                    }}
                    onClick={() => setSelectedSector(sector)}
                  >
                    <div className="relative">
                      <MapPin className={`h-6 w-6 ${getRiskColor(sector.riskLevel)}`} />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <p className="text-sm font-medium">{sector.sectorName}</p>
                        <p className="text-xs text-gray-500">{sector.cases} cases</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sector Details */}
        <div className="lg:col-span-1">
          {selectedSector ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">{selectedSector.sectorName} Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Cases</span>
                  <span className="font-medium">{selectedSector.details.activeCases}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Recovered</span>
                  <span className="font-medium">{selectedSector.details.recovered}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Hospitals</span>
                  <span className="font-medium">{selectedSector.details.hospitals}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Vaccinated</span>
                  <span className="font-medium">{selectedSector.details.vaccinated}</span>
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
              <p className="text-gray-500">Select a sector to view details</p>
            </div>
          )}

          {/* Risk Levels */}
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Risk Levels</h3>
            <div className="space-y-2">
              {gandhinagar.sectors.map((sector) => (
                <div key={sector.sectorName} className="flex items-center justify-between">
                  <span className="text-sm">{sector.sectorName}</span>
                  <div className="flex items-center">
                    <AlertTriangle className={`h-4 w-4 ${getRiskColor(sector.riskLevel)} mr-2`} />
                    <span className="text-sm capitalize">{sector.riskLevel}</span>
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

export default AdminMap;
