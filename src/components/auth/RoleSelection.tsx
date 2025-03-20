import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, Building as City, Shield } from "lucide-react";
import { motion } from "framer-motion";
import * as THREE from "three";

// Role definitions with health-system colors
const ROLES = [
  { name: "Hospital", icon: Stethoscope, path: "/hospital/login", color: "#4caf50", accent: "#c8e6c9" },
  { name: "District", icon: City, path: "/district-head/login", color: "#f57c00", accent: "#ffccbc" },
  { name: "State", icon: Shield, path: "/state-head/login", color: "#ab47bc", accent: "#e1bee7" },
];

const RoleSelection = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    // 3D Background Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Particle system
    const geometry = new THREE.SphereGeometry(0.05, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x90caf9 });
    const particles = Array.from({ length: 50 }, () => {
      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(
        Math.random() * 100 - 50,
        Math.random() * 100 - 50,
        Math.random() * 100 - 50
      );
      scene.add(particle);
      return particle;
    });

    camera.position.z = 5;

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      particles.forEach(particle => {
        particle.position.y += 0.005;
        if (particle.position.y > 50) particle.position.y = -50;
      });
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 opacity-20" 
      />
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold text-gray-800">
            Health Guard AI
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Smart Disease Monitoring Platform
          </p>
        </motion.div>

        {/* Centered grid with 3 items */}
        <div className="grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3 justify-center">
          {ROLES.map(({ name, icon: Icon, path, color, accent }, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              className="relative"
            >
              <div
                className="health-card flex h-72 w-64 cursor-pointer flex-col items-center justify-center rounded-xl p-6 shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${accent}, #ffffff)`,
                  border: `1px solid ${color}22`
                }}
                onClick={() => navigate(path)}
              >
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  whileHover={{ boxShadow: `0 0 15px ${color}44` }}
                  transition={{ duration: 0.3 }}
                />
                
                <motion.div
                  className="relative z-10 flex flex-col items-center"
                  whileHover={{ y: -5 }}
                >
                  <Icon className="h-16 w-16" style={{ color }} />
                  <span className="mt-6 text-xl font-semibold text-gray-800">
                    {name}
                  </span>
                  <p className="mt-2 text-sm text-gray-600">
                    Access Portal
                  </p>
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

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="fixed bottom-8 right-8 rounded-full p-3 shadow-lg"
          style={{ background: "#e3f2fd" }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 cursor-pointer"
          >
            <span className="text-xl text-white">AI</span>
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        body {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          font-family: "Inter", sans-serif;
        }
        .health-card {
          transition: transform 0.3s ease;
        }
        .health-card:hover {
          transform: translateY(-3px);
        }
      `}</style>
    </div>
  );
};

export default RoleSelection;