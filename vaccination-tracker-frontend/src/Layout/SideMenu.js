
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/SideMenu.css';

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log('SideMenu rendering');

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/students', label: 'Manage Students' },
    { path: '/drives', label: 'Manage Vaccination Drives' },
    { path: '/vaccines', label: 'Vaccine Inventory' },
    { path: '/vaccinedrive', label: 'Vaccination Drive' },
  ];

  return (
    <div className="side-menu">
      <h4>Menu</h4>
      <ul>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={isActive ? 'active' : ''}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideMenu;
