import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600">
          Get in touch with our team for any queries or support regarding the health monitoring system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <Mail className="h-6 w-6 text-blue-600" />
            <h2 className="ml-3 text-lg font-semibold text-gray-900">Email</h2>
          </div>
          <p className="text-gray-600">contact@gujarathealthmonitor.gov.in</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <Phone className="h-6 w-6 text-green-600" />
            <h2 className="ml-3 text-lg font-semibold text-gray-900">Phone</h2>
          </div>
          <p className="text-gray-600">1800-XXX-XXXX (Toll Free)</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <MapPin className="h-6 w-6 text-red-600" />
            <h2 className="ml-3 text-lg font-semibold text-gray-900">Address</h2>
          </div>
          <p className="text-gray-600">Health Monitoring Center, Gandhinagar, Gujarat</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Send className="h-5 w-5 mr-2" />
              Send Message
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">FAQs</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">What are the operating hours?</h3>
            <p className="text-gray-600">Our support team is available 24/7 for emergency assistance.</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">How can I report a health concern?</h3>
            <p className="text-gray-600">You can use the contact form above or call our toll-free number.</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">What is the response time?</h3>
            <p className="text-gray-600">We aim to respond to all queries within 24 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;