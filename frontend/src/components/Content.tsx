import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from './Table';

const Content: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<
    'Products' | 'Clothes'
  >('Products');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <select
        value={selectedOption}
        onChange={(e) =>
          setSelectedOption(e.target.value as 'Products' | 'Clothes')
        }
      >
        <option value="Products">Products</option>
        <option value="Clothes">Clothes</option>
      </select>
      <Table selectedOption={selectedOption} />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Content;
