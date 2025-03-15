import  'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Menu } from 'lucide-react';

const AdminLayout = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div className="flex">
      <AdminSidebar isOpen={isSidebarOpen} />
      <div className="flex-1">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-900">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">District Head Dashboard</h1>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;