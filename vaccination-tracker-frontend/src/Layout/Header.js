
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    document.body.style.overflowX = 'hidden';
    return () => {
      document.body.style.overflowX = 'auto';
    };
  }, []);

  return (
    <header className="header">
      <h2 onClick={() => navigate('/')}>School Vaccination System</h2>
      <div>
        {isLoggedIn ? (
          <button className="logout" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <button className="login" onClick={() => navigate('/login')}>
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;