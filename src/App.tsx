import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Role Selection Page
import RoleSelection from "./components/auth/RoleSelection";

// Citizen (User) Layout & Pages

import CitizenDashboard from "./pages/citizen/Dashboard";
import CitizenAlerts from "./pages/citizen/Alerts";
import CitizenPrediction from "./pages/citizen/Prediction";
import About from "./pages/citizen/About";
import Contact from "./pages/citizen/Contact";

// District-Head Layout & Pages

import AdminDashboard from "./pages/district-head/Dashboard";
import AdminAlerts from "./pages/district-head/Alerts";
import AdminReports from "./pages/district-head/Reports";
import AdminSettings from "./pages/district-head/Settings";
import AdminUsers from "./pages/district-head/Users";

// State-Head Layout & Pages

import SuperAdminDashboard from "./pages/state-head/Dashboard";
import SuperAdminAlerts from "./pages/state-head/Alerts";
import SuperAdminReports from "./pages/state-head/Reports";
import SuperAdminSettings from "./pages/state-head/Settings";
import SuperAdminUsers from "./pages/state-head/Users";

// Hospital Layout (Optional)

// Authentication Pages (Login & Signup)
import CitizenLogin from "./pages/citizen/Login";
import CitizenSignup from "./pages/citizen/Signup";




import AdminLayout from "./components/district-head/AdminLayout";
import DiseaseMap from "./pages/district-head/DiseaseMap";

import SuperAdminLayout from "./components/state-head/SuperAdminLayout";
import SuperDiseaseMap from "./pages/state-head/DiseaseMap";
import Prediction from "./pages/citizen/Prediction";
import UserLayout from "./components/citizen/UserLayout";
import News from "./pages/citizen/News";
import StateLogin from "./components/state-head/StateLogin";
import AdminLogin from "./components/district-head/AdminLogin";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import HospitalRegistrationForm from "./components/hospital/HospitalRegistrationForm";
import HospitalLoginForm from "./components/hospital/HospitalLoginForm";
import DiseaseDataEntry from "./components/hospital/DiseaseDataEntry";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <Routes>
        {/* Role Selection Page */}
        <Route path="/" element={<RoleSelection />} />

        {/* Authentication Routes */}
        <Route path="/citizen/login" element={<CitizenLogin role="user" />} />
        <Route path="/citizen/signup" element={<CitizenSignup role="user" />} />



        {/* Citizen Routes (Only Accessible by Users with Role 'citizen') */}
        <Route
          path="/citizen/"
          element={
            <UserLayout
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
          }
        >
          {" "}
          <Route index element={<Navigate to="/citizen/dashboard" replace />} />
          <Route path="dashboard" element={<CitizenDashboard />} />
          <Route path="alerts" element={<CitizenAlerts />} />
          <Route path="news" element={<News />} />
          <Route path="prediction" element={<CitizenPrediction />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* District-Head Routes (Only Accessible by Users with Role 'district-head') */}

        <Route path="/district-head/login" element={<AdminLogin />} />

        <Route
          path="/district-head/*"
          element={
            <ProtectedRoute
            element={
              <AdminLayout
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
              />
            }
              allowedRoles={["district-head"]}
              redirectPath="/district-head/login"
            />
          }
          >
          {" "}
          <Route
            index
            element={<Navigate to="/district-head/dashboard" replace />}
          />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="alerts" element={<AdminAlerts />} />
          <Route path="trends" element={<AdminAlerts />} />
          <Route path="map" element={<DiseaseMap />} />
          <Route path="Prediction" element={<Prediction />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* State-Head Routes */}
        {/* ✅ StateLogin Route OUTSIDE of SuperAdminLayout */}
        <Route path="/state-head/login" element={<StateLogin />} />

        {/* State-Head Routes (Only Accessible by Users with Role 'state-head') */}
        <Route
          path="/state-head/*"
          element={
            <ProtectedRoute
              element={<SuperAdminLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
              allowedRoles={["state-head"]}
              redirectPath="/state-head/login"
            />
          }
          >
          {" "}
          <Route
            index
            element={<Navigate to="/state-head/dashboard" replace />}
          />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="alerts" element={<SuperAdminAlerts />} />
          <Route path="trends" element={<SuperAdminAlerts />} />
          <Route path="map" element={<SuperDiseaseMap />} />
          <Route path="Prediction" element={<Prediction />} />
          <Route path="reports" element={<SuperAdminReports />} />
          <Route path="settings" element={<SuperAdminSettings />} />
          <Route path="users" element={<SuperAdminUsers />} />
        </Route>


        <Route path="/hospital/login" element={<HospitalLoginForm />} />
        <Route path="/hospital/register" element={<HospitalRegistrationForm />} />
        <Route path="/hospital/dashboard" element={<DiseaseDataEntry />} />





        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
