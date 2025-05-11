
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  // Refs to measure header and footer heights
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState('70px');
  const [footerHeight, setFooterHeight] = useState('50px');

  // Dynamically calculate header and footer heights
  useEffect(() => {
    const updateHeights = () => {
      if (headerRef.current) {
        setHeaderHeight(`${headerRef.current.offsetHeight}px`);
      }
      if (footerRef.current) {
        setFooterHeight(`${footerRef.current.offsetHeight}px`);
      }
    };

    updateHeights();
    window.addEventListener('resize', updateHeights);

    return () => {
      window.removeEventListener('resize', updateHeights);
    };
  }, []);

  return (
    <div className="home-container">
      <div ref={headerRef}>
        <Header isLoggedIn={false} />
      </div>
      <main
        className="home-main"
        style={{
          marginTop: headerHeight,
          marginBottom: footerHeight,
        }}
      >
        <div className="hero-section">
          <h1>Welcome to the School Vaccination Management System</h1>
          <p>
            Streamline your school's vaccination process with our easy-to-use platform. Track student vaccinations, manage upcoming drives, and ensure compliance—all in one place.
          </p>
          <button className="cta-button" onClick={() => navigate('/login')}>
            Get Started
          </button>
        </div>
      </main>
      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
};

export default Home;