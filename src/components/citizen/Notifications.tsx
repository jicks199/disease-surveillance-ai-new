import React from 'react';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'alert',
    title: 'Disease Outbreak Alert',
    message: 'Increased dengue cases reported in Ahmedabad district',
    time: '2 hours ago',
    icon: AlertTriangle,
    color: 'text-red-500',
    bgColor: 'bg-red-50'
  },
  {
    id: 2,
    type: 'info',
    title: 'Health Advisory',
    message: 'Take precautions against mosquito-borne diseases',
    time: '5 hours ago',
    icon: Info,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  {
    id: 3,
    type: 'success',
    title: 'Vaccination Drive',
    message: 'Successfully completed vaccination campaign in Surat',
    time: '1 day ago',
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-50'
  }
];

const Notifications = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-gray-500" />
            <h2 className="ml-2 text-lg font-semibold text-gray-900">Notifications</h2>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            Mark all as read
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start">
                <div className={`p-2 ${notification.bgColor} rounded-lg`}>
                  <Icon className={`h-5 w-5 ${notification.color}`} />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-gray-50">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800">
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default Notifications;