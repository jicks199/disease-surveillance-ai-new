// Mock data for Gujarat districts
export const gujaratDistricts = [
  'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch',
  'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka',
  'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch',
  'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal',
  'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar',
  'Tapi', 'Vadodara', 'Valsad'
];

export const diseases = [
  'COVID-19',
  'Malaria',
  'Dengue',
  'Tuberculosis',
  'Cholera',
  'Typhoid',
  'Chikungunya'
];

export const alerts = [
  {
    id: 1,
    title: 'COVID-19 Surge Alert',
    message: 'Significant increase in COVID-19 cases detected in Ahmedabad district',
    severity: 'high',
    timestamp: '2024-03-15T10:30:00Z',
    district: 'Ahmedabad'
  },
  {
    id: 2,
    title: 'Dengue Outbreak Warning',
    message: 'Multiple dengue cases reported in Surat, preventive measures advised',
    severity: 'medium',
    timestamp: '2024-03-15T09:15:00Z',
    district: 'Surat'
  },
  {
    id: 3,
    title: 'Malaria Prevention Notice',
    message: 'Increased mosquito breeding sites identified in Vadodara',
    severity: 'low',
    timestamp: '2024-03-15T08:00:00Z',
    district: 'Vadodara'
  }
];

export const districtData = gujaratDistricts.map(district => ({
  name: district,
  totalCases: Math.floor(Math.random() * 10000),
  activeCases: Math.floor(Math.random() * 5000),
  recovered: Math.floor(Math.random() * 4000),
  deaths: Math.floor(Math.random() * 1000),
  riskLevel: Math.random() > 0.5 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low'
}));

export const ageData = [
  { group: '0-18', count: 2345 },
  { group: '19-40', count: 5678 },
  { group: '41-60', count: 4321 },
  { group: '60+', count: 3456 }
];

export const genderData = [
  { gender: 'Male', count: 8765 },
  { gender: 'Female', count: 7654 },
  { gender: 'Other', count: 234 }
];