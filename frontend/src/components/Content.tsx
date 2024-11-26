import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from './Table';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const Dropdown = styled.select`
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const LogoutButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

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
    <Container>
      <Dropdown
        value={selectedOption}
        onChange={(e) =>
          setSelectedOption(e.target.value as 'Products' | 'Clothes')
        }
      >
        <option value="Products">Products</option>
        <option value="Clothes">Clothes</option>
      </Dropdown>
      <Table selectedOption={selectedOption} />
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
    </Container>
  );
};

export default Content;
