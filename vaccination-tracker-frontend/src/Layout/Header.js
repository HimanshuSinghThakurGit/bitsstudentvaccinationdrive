// // Header.js
// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const Header = ({ isLoggedIn, onLogout }) => {
//   const navigate = useNavigate();

//   return (
//     <header style={{ padding: '10px', backgroundColor: '#f5f5f5', display: 'flex', justifyContent: 'space-between' }}>
//       <h2 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>School Vaccination Management System</h2>
//       <div>
//         {isLoggedIn ? (
//           <button onClick={onLogout}>Logout</button>
//         ) : (
//           <button onClick={() => navigate('/login')}>Login</button>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;


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