// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000'); // Connect to your Flask backend

// const Chatbot: React.FC = () => {
//   const [alertMessage, setAlertMessage] = useState<string | null>(null);

//   useEffect(() => {
//     // Listen for alerts from the backend
//     socket.on('alert', (data: { message: string }) => {
//       setAlertMessage(data.message);
//       // Hide the alert after 5 seconds
//       setTimeout(() => {
//         setAlertMessage(null);
//       }, 5000);
//     });

//     // Cleanup on component unmount
//     return () => {
//       socket.off('alert');
//     };
//   }, []);

//   // Inline styles for the alert box
//   const alertBoxStyle: React.CSSProperties = {
//     position: 'fixed',
//     top: '20px',
//     right: '20px',
//     background: '#ff4444',
//     color: 'white',
//     padding: '20px',
//     borderRadius: '5px',
//     boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
//   };

//   return (
//     <div>
//       <h1>AI-Powered Disease Surveillance System</h1>
//       <p>Monitoring disease outbreaks...</p>
//       {alertMessage && (
//         <div style={alertBoxStyle}>
//           {alertMessage}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chatbot;





// frontend chatbot show :  



//       <div
//         style={{
//           position: 'fixed',
//           bottom: '20px',
//           right: '20px',
//           zIndex: 1000,
//         }}
//       >
//         {/* Chatbot Icon */}
//         <button
//           onClick={() => setIsChatbotOpen(!isChatbotOpen)}
//           style={{
//             background: '#f97316', // Vibrant orange
//             borderRadius: '50%',
//             width: '50px',
//             height: '50px',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
//             border: 'none',
//             cursor: 'pointer',
//             transition: 'transform 0.2s ease, box-shadow 0.2s ease', // Hover effect
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.transform = 'scale(1.1)';
//             e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.transform = 'scale(1)';
//             e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
//           }}
//         >
//           <MessageSquare style={{ color: '#fff', width: '24px', height: '24px' }} />
//         </button>

//         {/* Chatbot Popup */}
//         {isChatbotOpen && (
//           <div
//             style={{
//               position: 'absolute',
//               bottom: '60px',
//               right: '0',
//               width: '250px', // Slightly wider
//               background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', // Subtle red gradient
//               borderRadius: '16px',
//               boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
//               padding: '20px',
//               animation: 'slideInBounce 0.4s ease-out',
//             }}
//           >
//             <div
//               style={{
//                 background: '#ef4444', // Bold red header
//                 borderRadius: '8px 8px 0 0',
//                 padding: '10px 16px',
//                 margin: '-20px -20px 16px -20px', // Extend to edges
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//               }}
//             >
//               <div style={{ display: 'flex', alignItems: 'center' }}>
//                 <AlertTriangle style={{ color: '#fff', width: '22px', height: '22px', marginRight: '8px' }} />
//                 <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#fff' }}>
//                   ALERT
//                 </h3>
//               </div>
//               <button
//                 onClick={() => setIsChatbotOpen(false)}
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   cursor: 'pointer',
//                   color: '#fff',
//                   fontSize: '16px',
//                   fontWeight: '600',
//                 }}
//               >
//                 ✕
//               </button>
//             </div>
//             <p
//               style={{
//                 margin: '0',
//                 color: '#b91c1c', // Dark red for emphasis
//                 fontSize: '16px',
//                 fontWeight: '600',
//                 lineHeight: '1.5',
//                 textAlign: 'center', // Center for impact
//               }}
//             >
//               {alertMessage || 'No new alerts at this time.'}
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Inline CSS Animation */}
//       <style>
//         {`
//           @keyframes slideInBounce {
//             0% {
//               opacity: 0;
//               transform: translateY(30px);
//             }
//             70% {
//               opacity: 1;
//               transform: translateY(-5px);
//             }
//             100% {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
//         `}
//       </style>