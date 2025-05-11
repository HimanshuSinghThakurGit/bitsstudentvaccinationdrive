// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const SideMenu = () => {
//   const navigate = useNavigate();

//   return (
//     <div style={{ width: '200px', backgroundColor: '#f0f0f0', padding: '10px', height: '100vh' }}>
//       <h4>Menu</h4>
//       <ul style={{ listStyle: 'none', padding: 0 }}>
//         <li><button onClick={() => navigate('/dashboard')}>Dashboard</button></li>
//         <li><button onClick={() => navigate('/students')}>Manage Students</button></li>
//         <li><button onClick={() => navigate('/drives')}>Vaccination Drives</button></li>
//         <li><button onClick={() => navigate('/vaccines')}>Vaccine Inventory</button></li>
//       </ul>
//     </div>
//   );
// };

// export default SideMenu;

// // import React from 'react';
// // import { useNavigate, useLocation } from 'react-router-dom';
// // import '../styles/SideMenu.css'; // Import the CSS file

// // const SideMenu = () => {
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   const menuItems = [
// //     { path: '/dashboard', label: 'Dashboard'  },
// //     { path: '/students', label: 'Manage Students' },
// //     { path: '/drives', label: 'Vaccination Drives' },
// //     { path: '/vaccines', label: 'Vaccine Inventory'  },
// //   ];

// //   return (
// //     <div className="side-menu">
// //       <h4>Menu</h4>
// //       <ul>
// //         {menuItems.map((item) => {
// //           const isActive = location.pathname === item.path;

// //           return (
// //             <li key={item.path}>
// //               <button
// //                 onClick={() => navigate(item.path)}
// //                 className={isActive ? 'active' : ''}
// //               >
// //                 <span className="icon">{item.icon}</span>
// //                 <span>{item.label}</span>
// //               </button>
// //             </li>
// //           );
// //         })}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default SideMenu;

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
