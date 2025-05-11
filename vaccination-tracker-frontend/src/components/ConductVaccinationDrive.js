import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../Layout/DashboardLayout';
import '../styles/ConductVaccinationDrive.css';

function ConductVaccinationDrive() {
  const { logout } = useContext(AuthContext);
  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [filterVaccinated, setFilterVaccinated] = useState(null);

  // Fetch drives on mount
  useEffect(() => {
    const fetchDrives = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8082/api/upcomingdrives');
        if (!res.ok) throw new Error('Failed to fetch drives');
        const data = await res.json();
        setDrives(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDrives();
  }, []);

  // Handler for selecting a drive
  const handleDriveClick = async (drive) => {
    setLoading(true);
    setSelectedDrive(drive);
    try {
      const res = await fetch(`http://localhost:8082/api/drives/${drive.id}/students`);
      if (!res.ok) throw new Error('Failed to fetch students');
      const data = await res.json();
      // Convert vaccinationStatus string to boolean
      const normalized = data.map(s => ({
        ...s,
        vaccinationStatus: s.vaccinationStatus === 'true'
      }));
      setStudents(normalized);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle vaccination status
  const toggleVaccinationStatus = async (driveId, studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const confirmMessage = student.vaccinationStatus
      ? `Are you sure you want to mark ${student.name} as not vaccinated?`
      : `Are you sure you want to mark ${student.name} as vaccinated?`;
    if (!window.confirm(confirmMessage)) return;

    const newStatus = !student.vaccinationStatus;
    try {
      const res = await fetch(
        `http://localhost:8082/api/vaccination-drives/${driveId}/students/${studentId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vaccinationStatus: newStatus.toString() }),
        }
      );
      if (!res.ok) throw new Error('Failed to update status');
      // Update state
      setStudents(prev => prev.map(s =>
        s.id === studentId ? { ...s, vaccinationStatus: newStatus } : s
      ));
    } catch (err) {
      alert(err.message);
    }
  };

  // Filter & sort
  const sortedAndFiltered = students
    .filter(s => filterVaccinated === null ? true : s.vaccinationStatus === filterVaccinated)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'classGrade') return a.classGrade.localeCompare(b.classGrade);
      return 0;
    });

  if (loading) return (
    <DashboardLayout isLoggedIn onLogout={logout}>
      <div className="conduct-drive-container">Loading...</div>
    </DashboardLayout>
  );
  if (error) return (
    <DashboardLayout isLoggedIn onLogout={logout}>
      <div className="conduct-drive-container">Error: {error}</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout isLoggedIn onLogout={logout}>
      <div className="conduct-drive-container">
        <h1>Conduct Vaccination Drive</h1>
        {!selectedDrive ? (
          <div className="drives-list">
            <h2>Upcoming Drives (Next 30 Days)</h2>
            {drives.length === 0 ? (
              <p>No drives scheduled.</p>
            ) : drives.map(d => (
              <div key={d.id} className="drive-card" onClick={() => handleDriveClick(d)}>
                <h3>{d.name}</h3>
                <p>Date: {d.startDate}</p>
                <p>Location: {d.location}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="students-list">
            <div className="drive-header">
              <h2>{selectedDrive.name}</h2>
              <button onClick={() => {setSelectedDrive(null); setStudents([]); setFilterVaccinated(null); setSortBy('name');}}>
                Back to Drives
              </button>
            </div>
            <h3>Students</h3>
            <div className="filters">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="name">Name</option>
                <option value="classGrade">Class</option>
              </select>
              <select value={filterVaccinated === null ? 'all' : String(filterVaccinated)} onChange={e => {
                const v = e.target.value;
                setFilterVaccinated(v==='all'?null:v==='true');
              }}>
                <option value="all">All</option>
                <option value="true">Vaccinated</option>
                <option value="false">Not Vaccinated</option>
              </select>
            </div>
            {sortedAndFiltered.length === 0 ? <p>No students match.</p> : (
              <table className="students-table">
                <thead><tr><th>Name</th><th>Class</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {sortedAndFiltered.map(s => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.classGrade}</td>
                      <td className={s.vaccinationStatus? 'status-vaccinated':'status-not-vaccinated'}>
                        {s.vaccinationStatus? 'Vaccinated':'Not Vaccinated'}
                      </td>
                      <td>
                        <button className={`toggle-button ${s.vaccinationStatus? 'not-vaccinated':'vaccinated'}`}
                          onClick={() => toggleVaccinationStatus(selectedDrive.id, s.id)}>
                          {s.vaccinationStatus? 'Mark Not Vaccinated':'Mark Vaccinated'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ConductVaccinationDrive;
