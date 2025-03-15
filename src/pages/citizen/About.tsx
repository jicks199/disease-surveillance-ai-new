import React from 'react';
import { Shield, Activity, Brain, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About Gujarat Health Monitor</h1>
        <p className="text-lg text-gray-600">
          A state-of-the-art disease surveillance system powered by artificial intelligence to protect and improve public health across Gujarat.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-gray-600">
          To create a robust and responsive health monitoring system that helps prevent disease outbreaks and ensures timely interventions through advanced technology and data-driven insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="ml-3 text-lg font-semibold text-gray-900">Protection</h2>
          </div>
          <p className="text-gray-600">
            Safeguarding public health through early detection and prevention of disease outbreaks across Gujarat.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <Activity className="h-6 w-6 text-green-600" />
            <h2 className="ml-3 text-lg font-semibold text-gray-900">Monitoring</h2>
          </div>
          <p className="text-gray-600">
            Real-time surveillance of health trends and patterns to ensure quick response to emerging health concerns.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <Brain className="h-6 w-6 text-purple-600" />
            <h2 className="ml-3 text-lg font-semibold text-gray-900">Innovation</h2>
          </div>
          <p className="text-gray-600">
            Leveraging artificial intelligence and advanced analytics to predict and prevent health issues.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-yellow-600" />
            <h2 className="ml-3 text-lg font-semibold text-gray-900">Community</h2>
          </div>
          <p className="text-gray-600">
            Engaging with healthcare providers and communities to create a collaborative health monitoring network.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-gray-900 font-medium">Real-time Disease Tracking</p>
              <p className="text-gray-500">Monitor disease outbreaks and health trends as they happen.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-gray-900 font-medium">AI-Powered Predictions</p>
              <p className="text-gray-500">Advanced algorithms to forecast potential health risks.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">3</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-gray-900 font-medium">Interactive Maps</p>
              <p className="text-gray-500">Visualize health patterns across different regions of Gujarat.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">4</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-gray-900 font-medium">Alert System</p>
              <p className="text-gray-500">Instant notifications about health risks in your area.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
        <div className="space-y-2">
          <p className="text-gray-600">
            <strong>Address:</strong> Health Monitoring Center, Gandhinagar, Gujarat
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> contact@gujarathealthmonitor.gov.in
          </p>
          <p className="text-gray-600">
            <strong>Emergency Helpline:</strong> 1800-XXX-XXXX
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;