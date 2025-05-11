
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../Layout/DashboardLayout';
import '../styles/Dashboard.css';

// function Dashboard() {
//   const { user, logout } = useContext(AuthContext);

//   return (
//     <DashboardLayout isLoggedIn={true} onLogout={logout}>
//       <div className="dashboard-container">
//         <h1>Dashboard</h1>
//         <p className="welcome-message">Welcome to the admin dashboard.</p>
//         <p className="user-info">
//           Welcome, {user?.role}: {user?.username}. Use the side menu to manage data.
//         </p>
//         <h2>Dashboard Overview</h2>
//         <div className="stats-container">
//           <div className="stat-card">
//             <p>Total Students</p>
//             <p>200</p>
//           </div>
//           <div className="stat-card vaccinated">
//             <p>Vaccinated</p>
//             <p>150 (75%)</p>
//           </div>
//           <div className="stat-card upcoming-drives">
//             <p>Upcoming Drives</p>
//             <p>3 (next 30 days)</p>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

// export default Dashboard;

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [totalStudents, setTotalStudents] = useState(0);
  const [vaccinatedCount, setVaccinatedCount] = useState(0);
  const [upcomingDrives, setUpcomingDrives] = useState(0);

  useEffect(() => {
    // Fetch real stats from backend
    const fetchStats = async () => {
      try {
        const resp = await fetch('/api/students/stats');
        if (!resp.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }
        const { totalStudents, vaccinatedCount, upcomingDrives } = await resp.json();
        setTotalStudents(totalStudents);
        setVaccinatedCount(vaccinatedCount);
        setUpcomingDrives(upcomingDrives);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);


  const handleDrivesClick = () => {
    navigate('/vaccinedrive');
  };

  const vaccinatedPercentage = totalStudents > 0 ? ((vaccinatedCount / totalStudents) * 100).toFixed(1) : 0;

  return (
    <DashboardLayout isLoggedIn={!!user} onLogout={logout}>
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        <p className="welcome-message">Welcome to the admin dashboard.</p>
        <p className="user-info">
          Welcome, {user?.role}: {user?.username}. Use the side menu to manage data.
        </p>
        <h2>Dashboard Overview</h2>
        <div className="stats-container">
          <div className="stat-card">
            <p>Total Students</p>
            <p>{totalStudents}</p>
          </div>
          <div className="stat-card vaccinated">
            <p>Vaccinated</p>
            <p>{vaccinatedCount} ({vaccinatedPercentage}%)</p>
          </div>
          <div
            className="stat-card upcoming-drives"
            onClick={handleDrivesClick}
            style={{ cursor: 'pointer' }}
          >
            <p>Upcoming Drives</p>
            <p>{upcomingDrives} (next 30 days)</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
