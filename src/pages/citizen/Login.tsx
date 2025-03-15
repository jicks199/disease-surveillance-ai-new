import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CitizenLoginProps {
  role: string; // ✅ Define 'role' as a prop
}

const CitizenLogin: React.FC<CitizenLoginProps> = ({ role }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCitizenLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold">{role.toUpperCase()} CitizenLOGIN</h2>
      <form onSubmit={handleCitizenLogin} className="space-y-4 w-80 mt-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
          CitizenLogin
        </button>
      </form>
    </div>
  );
};

export default CitizenLogin;
