import React from 'react';
import Header from './Header';
import Footer from './Footer';

const NotFound = () => {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: '50px' }}>
      <Header isLoggedIn={false} />
      <main style={{ padding: '20px', textAlign: 'center' }}>
        <h2>404 - Page Not Found</h2>
        <p>Sorry, the page you're looking for doesn't exist.</p>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;