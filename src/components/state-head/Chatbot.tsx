import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to your Flask backend

const Chatbot: React.FC = () => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    // Listen for alerts from the backend
    socket.on('alert', (data: { message: string }) => {
      setAlertMessage(data.message);
      // Hide the alert after 5 seconds
      setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('alert');
    };
  }, []);

  // Inline styles for the alert box
  const alertBoxStyle: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: '#ff4444',
    color: 'white',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
  };

  return (
    <div>
      <h1>AI-Powered Disease Surveillance System</h1>
      <p>Monitoring disease outbreaks...</p>
      {alertMessage && (
        <div style={alertBoxStyle}>
          {alertMessage}
        </div>
      )}
    </div>
  );
};

export default Chatbot;