import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/state-head/Sidebar';
import { Navbar } from '../components/state-head/Navbar';
import { Footer } from '../components/state-head/Footer';

export function StateHeadLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}