import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import routes from './routes/routes';
function App() {
  return (
    <Router>
    <AuthProvider>
      <Routes>
        {routes.map((route, idx) => (
          <Route key={idx} path={route.path} element={route.element} />
        ))}
      </Routes>
    </AuthProvider>
  </Router>
  );
}

export default App;


