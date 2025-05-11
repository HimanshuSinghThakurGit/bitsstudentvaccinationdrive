
// import React from 'react';

// const Footer = () => {
//   return (
//     <footer style={{ padding: '10px', textAlign: 'center', backgroundColor: '#eee', position: 'fixed', bottom: 0, width: '100%' }}>
//       <p>&copy; 2025 School Vaccination Management Syatem</p>
//     </footer>
//   );
// };

// export default Footer;

import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} School Vaccination Management System. All rights reserved.</p>
    </footer>
  );
};

export default Footer;