import React from 'react';
import { Link } from 'react-router-dom';


const Sidebar = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '200px',
        height: '100vh',
        backgroundColor: '#f4f4f4',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h3 style={{ marginBottom: '20px' }}>Sidebar</h3>
      <Link to="/hoddashboard" style={{ marginBottom: '10px', textDecoration: 'none', color: '#333' }}>
       Home
      </Link>
      <Link to="/secondyear" style={{ marginBottom: '10px', textDecoration: 'none', color: '#333' }}>
        2nd year
      </Link>
      <Link to="/thirdyear" style={{ marginBottom: '10px', textDecoration: 'none', color: '#333' }}>
      3rd year
      </Link>
      <Link to="/fourthyear" style={{ textDecoration: 'none', color: '#333' }}>
      4th year
      </Link>
    </div>
  );
};

export default Sidebar;
