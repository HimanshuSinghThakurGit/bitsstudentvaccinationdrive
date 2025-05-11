import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import Footer from './Footer';
import SideMenu from './SideMenu';
import '../styles/DashboardLayout.css';

const DashboardLayout = ({ children, isLoggedIn, onLogout }) => {
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState('70px');
  const [footerHeight, setFooterHeight] = useState('50px');

  useEffect(() => {
    const updateHeights = () => {
      if (headerRef.current) {
        console.log('Header Height:', headerRef.current.offsetHeight);
        setHeaderHeight(`${headerRef.current.offsetHeight}px`);
      }
      if (footerRef.current) {
        console.log('Footer Height:', footerRef.current.offsetHeight);
        setFooterHeight(`${footerRef.current.offsetHeight}px`);
      }
    };

    updateHeights();
    window.addEventListener('resize', updateHeights);

    return () => {
      window.removeEventListener('resize', updateHeights);
    };
  }, []);

  const sideMenuWidth = isLoggedIn ? '220px' : '0px';

  return (
    <div className="dashboard-layout">
      <div ref={headerRef}>
        <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
      </div>

      <div
        className="dashboard-layout-main"
        style={{
          marginTop: headerHeight,
          marginBottom: footerHeight,
        }}
      >
        {isLoggedIn && (
          <div
            className="side-menu-container"
            style={{
              top: headerHeight,
              bottom: footerHeight,
              width: sideMenuWidth,
              minHeight: `calc(100vh - ${headerHeight} - ${footerHeight})`,
            }}
          >
            <SideMenu />
          </div>
        )}

        <main
          className="dashboard-layout-content"
          style={{
            marginLeft: sideMenuWidth,
            width: `calc(100% - ${sideMenuWidth})`,
            minHeight: `calc(100vh - ${headerHeight} - ${footerHeight})`,
          }}
        >
          {children}
        </main>
      </div>

      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;