import React, { useState, useEffect } from 'react';
import AdminTrends from '../../components/state-head/SuperAdminTrends';
import { Activity, Users, AlertTriangle, Guitar as Hospital, MessageSquare } from 'lucide-react';
import io from 'socket.io-client';

const socket = io('http://127.0.0.1:5000'); // Connect to Flask backend

const StatCard = ({ icon: Icon, title, value, change, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <div className="flex items-center">
      <div className={`p-3 ${color} rounded-lg`}>
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '+' : ''}{change}% from last month
        </p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Handle SocketIO alerts
  useEffect(() => {
    socket.on('connect', () => console.log('Connected to SocketIO'));
    socket.on('alert', (data: { message: string }) => {
      console.log('Alert received:', data.message);
      setAlertMessage(data.message);
      setIsChatbotOpen(true);
      setTimeout(() => {
        setIsChatbotOpen(false);
        setAlertMessage(null);
      }, 10000); // 10 seconds visibility
    });
    return () => {
      socket.off('alert');
      socket.off('connect');
    };
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Activity}
          title="Total Cases"
          value="45,678"
          change={8}
          color="bg-indigo-50"
        />
        <StatCard
          icon={Users}
          title="Active Cases"
          value="1,234"
          change={12}
          color="bg-green-50"
        />
        <StatCard
          icon={AlertTriangle}
          title="Recovery Rate"
          value="23%"
          change={-5}
          color="bg-yellow-50"
        />
        <StatCard
          icon={Hospital}
          title="Mortality Rate"
          value="20%"
          change={3}
          color="bg-purple-50"
        />
      </div>

      <div>
        <AdminTrends />
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
        }}
      >
        {/* Chatbot Icon */}
        <button
          onClick={() => setIsChatbotOpen(!isChatbotOpen)}
          style={{
            background: '#f97316', // Vibrant orange
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease', // Hover effect
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
          }}
        >
          <MessageSquare style={{ color: '#fff', width: '24px', height: '24px' }} />
        </button>

        {/* Chatbot Popup */}
        {isChatbotOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: '60px',
              right: '0',
              width: '250px', // Slightly wider
              background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', // Subtle red gradient
              borderRadius: '16px',
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
              padding: '20px',
              animation: 'slideInBounce 0.4s ease-out',
            }}
          >
            <div
              style={{
                background: '#ef4444', // Bold red header
                borderRadius: '8px 8px 0 0',
                padding: '10px 16px',
                margin: '-20px -20px 16px -20px', // Extend to edges
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <AlertTriangle style={{ color: '#fff', width: '22px', height: '22px', marginRight: '8px' }} />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                  ALERT
                </h3>
              </div>
              <button
                onClick={() => setIsChatbotOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                }}
              >
                ✕
              </button>
            </div>
            <p
              style={{
                margin: '0',
                color: '#b91c1c', // Dark red for emphasis
                fontSize: '16px',
                fontWeight: '600',
                lineHeight: '1.5',
                textAlign: 'center', // Center for impact
              }}
            >
              {alertMessage || 'No new alerts at this time.'}
            </p>
          </div>
        )}
      </div>

      {/* Inline CSS Animation */}
      <style>
        {`
          @keyframes slideInBounce {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            70% {
              opacity: 1;
              transform: translateY(-5px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;