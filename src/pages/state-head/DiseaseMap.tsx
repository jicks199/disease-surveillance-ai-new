import  'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import { AlertTriangle } from 'lucide-react';  // Lucide icon
import 'leaflet/dist/leaflet.css';
import gujaratGeoJSON from './gujarat.geo.json'; // Add your Gujarat GeoJSON file

const DiseaseMap = () => {
    const outbreakData = [
        { position: [23.0225, 72.5714], type: 'critical', city: 'Ahmedabad' },
        { position: [22.3072, 73.1812], type: 'critical', city: 'Vadodara' },
        { position: [21.1702, 72.8311], type: 'moderate', city: 'Surat' },
        { position: [23.2156, 72.6369], type: 'moderate', city: 'Gandhinagar' },
        { position: [23.2410, 69.6669], type: 'safe', city: 'Kutch' },
        { position: [21.7051, 72.9959], type: 'safe', city: 'Bharuch' }
    ];

    const getColor = (type) => {
        switch (type) {
            case 'critical': return 'text-red-500';
            case 'moderate': return 'text-orange-500';
            case 'safe': return 'text-green-500';
            default: return 'text-gray-500';
        }
    };

    const geoStyle = {
        fillColor: '#E3F2FD',  // Light Blue for Gujarat
        color: '#1565C0',      // Dark Blue Border
        weight: 2,
    };

    return (
        <div className="flex p-4 bg-gray-100 min-h-screen">
            {/* Sidebar Legend */}
            <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
                <h2 className="font-bold text-lg mb-2">Outbreak Zones</h2>
                <ul>
                    <li className="flex items-center">
                        <AlertTriangle className="text-red-500 mr-2" /> Critical Zones (Ahmedabad, Vadodara)
                    </li>
                    <li className="flex items-center">
                        <AlertTriangle className="text-orange-500 mr-2" /> Moderate Risk Areas (Surat, Gandhinagar)
                    </li>
                    <li className="flex items-center">
                        <AlertTriangle className="text-green-500 mr-2" /> Safe Zones (Kutch, Bharuch)
                    </li>
                </ul>
            </div>

            {/* Map Section */}
            <div className="w-3/4 h-[600px] ml-4">
                <MapContainer
                    center={[22.2587, 71.1924]}  // Gujarat's Center
                    zoom={7}
                    className="h-full rounded-lg"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Gujarat GeoJSON Map */}
                    <GeoJSON data={gujaratGeoJSON} style={geoStyle} />

                    {/* Outbreak Data Markers */}
                    {outbreakData.map((data, idx) => (
                        <Marker key={idx} position={data.position}>
                            <Popup>
                                <div className={`font-bold ${getColor(data.type)}`}>
                                    {data.city} - {data.type.toUpperCase()} Zone
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
