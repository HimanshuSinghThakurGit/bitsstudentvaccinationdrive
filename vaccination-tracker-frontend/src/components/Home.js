// src/pages/Home.js
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div style={{ minHeight: '200vh', paddingBottom: '50px' }}>
      <Header isLoggedIn={false} />
      <main style={{ padding: '300px' }}>
        <h1>Welcome to the School Vaccination Management Syatem</h1>
      </main>
      <Footer />
    </div>
  );
};

export default Home;

