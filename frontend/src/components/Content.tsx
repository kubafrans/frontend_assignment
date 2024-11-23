import React from 'react';
import { useNavigate } from 'react-router-dom';

const Content: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome to the Content Component</h1>
      <p>This is where your content will go.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Content;
