import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Stethoscope, Building as City, Shield } from "lucide-react";
import { motion } from "framer-motion";
import * as THREE from "three";

// Role definitions with health-system colors
const roles = [
  { name: "Citizen", icon: User, path: "/citizen/", color: "#1e88e5", accent: "#bbdefb" },
  { name: "Hospital", icon: Stethoscope, path: "/hospital/login", color: "#4caf50", accent: "#c8e6c9" },
  { name: "District", icon: City, path: "/district-head/login", color: "#f57c00", accent: "#ffccbc" },
  { name: "State", icon: Shield, path: "/state-head/login", color: "#ab47bc", accent: "#e1bee7" },
];

const RoleSelection = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Subtle 3D Background Setup
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Soft floating particles
    const geometry = new THREE.SphereGeometry(0.05, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x90caf9 });
    const particles = [];
    
    for (let i = 0; i < 50; i++) {
      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(
        Math.random() * 100 - 50,
        Math.random() * 100 - 50,
        Math.random() * 100 - 50
      );
      scene.add(particle);
      particles.push(particle);
    }

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      particles.forEach(p => {
        p.position.y += 0.005;
        if (p.position.y > 50) p.position.y = -50;
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => renderer.dispose();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20" />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Clean Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800">
            Health Gaurd AI
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Smart Disease Monitoring Platform</p>
        </motion.div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl">
          {roles.map(({ name, icon: Icon, path, color, accent }, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              className="relative"
            >
              <div
                className="health-card w-64 h-72 rounded-xl p-6 cursor-pointer shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${accent}, #ffffff)`,
                  border: `1px solid ${color}22`
                }}
                onClick={() => navigate(path)}
              >
                {/* Subtle Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  whileHover={{ boxShadow: `0 0 15px ${color}44` }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Role Content */}
                <motion.div
                  className="relative z-10 flex flex-col items-center justify-center h-full"
                  whileHover={{ y: -5 }}
                >
                  <Icon className="w-16 h-16" style={{ color }} />
                  <span className="mt-6 text-xl font-semibold text-gray-800">
                    {name}
                  </span>
                  <p className="mt-2 text-sm text-gray-600">Access Portal</p>
                  <motion.div
                    className="mt-4 h-1 w-16 rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: 64 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chatbot Interface */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="fixed bottom-8 right-8 p-3 rounded-full shadow-lg"
          style={{ background: '#e3f2fd' }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer"
          >
            <span className="text-white text-xl">AI</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        body {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          font-family: 'Inter', sans-serif;
        }
        .health-card {
          transition: all 0.3s ease;
        }
        .health-card:hover {
          transform: translateY(-3px);
        }
      `}</style>
    </div>
  );
};

export default RoleSelection;