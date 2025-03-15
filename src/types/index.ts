export interface DiseaseCase {
  id: string;
  disease: string;
  district: string;
  cases: number;
  recovered: number;
  deaths: number;
  date: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface District {
  id: string;
  name: string;
  totalCases: number;
  activeCases: number;
  recovered: number;
  deaths: number;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'danger';
  timestamp: string;
}