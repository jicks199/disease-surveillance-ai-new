import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import { AlertTriangle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import gujaratGeoJSON from './gujarat.geo.json'; // Gujarat Map Data

const DiseaseMap = () => {
    const [selectedSector, setSelectedSector] = useState(null);

    // Gandhinagar sector-wise outbreak data
    const gandhinagarSectors = [
        {
            sectorName: 'Sector 1',
            cases: 50,
            position: [23.2156, 72.6369],
            riskLevel: 'moderate',
        },
        {
            sectorName: 'Sector 7',
            cases: 30,
            position: [23.2234, 72.6412],
            riskLevel: 'low',
        },
        {
            sectorName: 'Sector 21',
            cases: 45,
            position: [23.2398, 72.6543],
            riskLevel: 'high',
        },
    ];

    const getColor = (riskLevel) => {
        switch (riskLevel) {
            case 'high': return 'text-red-500';
            case 'moderate': return 'text-orange-500';
            case 'low': return 'text-green-500';
            default: return 'text-gray-500';
        }
    };

    const geoStyle = {
        fillColor: '#E3F2FD', // Light Blue for Gujarat
        color: '#1565C0',     // Dark Blue Border
        weight: 2,
    };

    return (
        <div className="flex p-4 bg-gray-100 min-h-screen">
            {/* Sidebar for Gandhinagar Sectors */}
            <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
                <h2 className="font-bold text-lg mb-2">Gandhinagar - Sector-wise Zones</h2>
                <ul>
                    {gandhinagarSectors.map((sector) => (
                        <li key={sector.sectorName} className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                            onClick={() => setSelectedSector(sector)}>
                            <AlertTriangle className={`${getColor(sector.riskLevel)} mr-2`} />
                            {sector.sectorName} - {sector.riskLevel.toUpperCase()}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Map Section */}
            <div className="w-3/4 h-[600px] ml-4">
                <MapContainer
                    center={[23.2234, 72.6412]} // Centered on Gandhinagar
                    zoom={13}
                    className="h-full rounded-lg"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Gujarat GeoJSON Map */}
                    <GeoJSON data={gujaratGeoJSON} style={geoStyle} />

                    {/* Gandhinagar Sector Markers */}
                    {gandhinagarSectors.map((sector, idx) => (
                        <Marker key={idx} position={sector.position}>
                            <Popup>
                                <div className={`font-bold ${getColor(sector.riskLevel)}`}>
                                    {sector.sectorName} - {sector.riskLevel.toUpperCase()} Risk <br />
                                    Cases: {sector.cases}
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
