import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import TeachersAdd from '../components/teachersadd';
import AddClass from '../components/addclass';

const HOD = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const [bubbles, setBubbles] = useState([]);
  
  useEffect(() => {
    // Generate random bubbles for the background
    const newBubbles = [];
    for (let i = 0; i < 15; i++) {
      newBubbles.push({
        id: i,
        size: Math.random() * 60 + 20,
        posX: Math.random() * 100,
        posY: Math.random() * 100,
        speed: Math.random() * 20 + 10,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    setBubbles(newBubbles);
  }, []);
  
  return (
    <div className="dashboard-container">
      <div className="bubbles-container">
        {bubbles.map((bubble) => (
          <div 
            key={bubble.id} 
            className="bubble"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.posX}%`,
              top: `${bubble.posY}%`,
              animationDuration: `${bubble.speed}s`,
              opacity: bubble.opacity
            }}
          />
        ))}
      </div>
      
      <Sidebar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>HOD Dashboard</h1>
          <div className="user-profile">
            <div className="user-avatar">
              <span>HOD</span>
            </div>
            <div className="welcome-message">Welcome, Department Head</div>
          </div>
        </div>
        
        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'teachers' ? 'active' : ''}`}
            onClick={() => setActiveTab('teachers')}
          >
            Manage Teachers
          </button>
          <button 
            className={`tab-button ${activeTab === 'classes' ? 'active' : ''}`}
            onClick={() => setActiveTab('classes')}
          >
            Manage Classes
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'teachers' ? (
            <div className="section teachers-section">
              <h2>Add New Teachers</h2>
              <p className="section-description">
                Add teachers with their credentials and assign classes
              </p>
              <TeachersAdd />
            </div>
          ) : (
            <div className="section classes-section">
              <h2>Add New Class</h2>
              <p className="section-description">
                Upload class data for different years using CSV files
              </p>
              <AddClass />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background-color: #f5f7fa;
          background: linear-gradient(135deg, #f5f7fa, #e6f3ff);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          position: relative;
          overflow: hidden;
        }
        
        .bubbles-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        
        .bubble {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(25, 42, 86, 0.4), rgba(13, 24, 55, 0.5));
          animation: float infinite;
          animation-timing-function: linear;
          backdrop-filter: blur(1px);
          box-shadow: inset 0 0 10px rgba(70, 130, 255, 0.3), 0 0 20px rgba(0, 30, 90, 0.2);
          border: 1px solid rgba(70, 130, 255, 0.2);
        }
        
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) translateX(10px) rotate(120deg);
          }
          66% {
            transform: translateY(-40px) translateX(-10px) rotate(240deg);
          }
          100% {
            transform: translateY(-60px) translateX(0) rotate(360deg) scale(0.8);
            opacity: 0;
          }
        }
        
        .dashboard-content {
          flex: 1;
          padding: 24px;
          margin-left: 250px; /* Adjust based on your sidebar width */
          z-index: 1;
          position: relative;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e1e5eb;
        }
        
        .dashboard-header h1 {
          color: #1a3a6a;
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        
        .user-profile {
          display: flex;
          align-items: center;
        }
        
        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3a7bd5, #3a6073);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          margin-right: 12px;
        }
        
        .welcome-message {
          font-size: 14px;
          color: #5e6e82;
        }
        
        .dashboard-tabs {
          display: flex;
          margin-bottom: 24px;
          border-bottom: 1px solid #e1e5eb;
        }
        
        .tab-button {
          padding: 12px 24px;
          background: none;
          border: none;
          font-size: 15px;
          font-weight: 500;
          color: #5e6e82;
          cursor: pointer;
          position: relative;
          transition: color 0.3s;
        }
        
        .tab-button:hover {
          color: #1a3a6a;
        }
        
        .tab-button.active {
          color: #3a7bd5;
          font-weight: 600;
        }
        
        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: #3a7bd5;
          border-radius: 3px 3px 0 0;
        }
        
        .tab-content {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(10px);
          background-color: rgba(255, 255, 255, 0.9);
        }
        
        .section {
          padding: 24px;
        }
        
        .section h2 {
          color: #1a3a6a;
          margin-top: 0;
          margin-bottom: 8px;
          font-size: 20px;
        }
        
        .section-description {
          color: #5e6e82;
          margin-bottom: 24px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default HOD;