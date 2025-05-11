import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import '../styles/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
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

  const handleLogin = async () => {
    const result = await login(username, password);
    if (result?.status === 'success') {
      navigate('/dashboard');
    } else {
      alert(result?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div ref={headerRef}>
        <Header isLoggedIn={false} />
      </div>
      <main
        className="login-main"
        style={{
          marginTop: headerHeight,
          marginBottom: footerHeight,
        }}
      >
        <div className="login-form">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      </main>
      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
}

export default Login;