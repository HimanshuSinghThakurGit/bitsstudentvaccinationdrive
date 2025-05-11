import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../Layout/DashboardLayout';
import axios from 'axios';
import '../styles/DriveManagement.css';

function DriveManagement() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [drives, setDrives] = useState([]);
    const [vaccines, setVaccines] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        vaccineId: '',
        startDate: '',
        endDate: '',
        availableDoses: 0,
        applicableClasses: [],
        location: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchDrives();
        fetchVaccines();
    }, []);

    const fetchDrives = async () => {
        try {
            const response = await axios.get('/api/drives');
            setDrives(response.data);
        } catch (error) {
            console.error('Error fetching drives:', error);
            alert('Failed to fetch drives');
        }
    };

    const fetchVaccines = async () => {
        try {
            const response = await axios.get('/api/vaccines');
            setVaccines(response.data);
        } catch (error) {
            console.error('Error fetching vaccines:', error);
            alert('Failed to fetch vaccines');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'availableDoses' ? parseInt(value) || 0 : value 
        }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleDateChange = (dates) => {
        setFormData(prev => ({
            ...prev,
            startDate: dates[0],
            endDate: dates[1]
        }));
        if (errors.startDate || errors.endDate) {
            setErrors(prev => ({ ...prev, startDate: '', endDate: '' }));
        }
    };

    const handleClassSelect = (selectedClasses) => {
        setFormData(prev => ({ ...prev, applicableClasses: selectedClasses }));
    };

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        const minDate = new Date();
        minDate.setDate(today.getDate() + 15);

        if (!formData.name.trim()) newErrors.name = 'Drive name is required';
        if (!formData.vaccineId) newErrors.vaccineId = 'Vaccine is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (formData.applicableClasses.length === 0) newErrors.applicableClasses = 'Select at least one class';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            
            if (start < minDate) newErrors.startDate = 'Drive must be scheduled at least 15 days in advance';
            if (end < start) newErrors.endDate = 'End date cannot be before start date';
            if ((end - start) / (1000 * 60 * 60 * 24) > 7) newErrors.endDate = 'Drive cannot exceed 7 days';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const checkForConflicts = async () => {
        try {
            const response = await axios.post('/api/drives/check-conflict', {
                startDate: formData.startDate,
                endDate: formData.endDate,
                excludeId: formData.id
            });
            return response.data.hasConflict;
        } catch (error) {
            console.error('Error checking conflicts:', error);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        const hasConflict = await checkForConflicts();
        if (hasConflict) {
            alert('There is already a drive scheduled during this time period');
            return;
        }

        try {
            const method = formData.id ? 'put' : 'post';
            const url = formData.id ? `/api/drives/${formData.id}` : '/api/drives';
            
            await axios[method](url, formData);
            fetchDrives();
            setShowForm(false);
            setFormData({
                name: '',
                vaccineId: '',
                startDate: '',
                endDate: '',
                availableDoses: 0,
                applicableClasses: [],
                location: ''
            });
            alert(`Drive ${formData.id ? 'updated' : 'created'} successfully!`);
        } catch (error) {
            console.error('Error saving drive:', error);
            alert(`Failed to save drive: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleCancelDrive = async (id) => {
        if (window.confirm('Are you sure you want to cancel this drive?')) {
            try {
                await axios.put(`/api/drives/${id}/cancel`);
                fetchDrives();
                alert('Drive cancelled successfully');
            } catch (error) {
                console.error('Error cancelling drive:', error);
                alert(`Failed to cancel drive: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this drive?')) {
            try {
                await axios.delete(`/api/drives/${id}`);
                fetchDrives();
                alert('Drive deleted successfully');
            } catch (error) {
                console.error('Error deleting drive:', error);
                alert(`Failed to delete drive: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    const isPastOrCancelledDrive = (drive) => {
        return drive.status === 'COMPLETED' || drive.status === 'CANCELLED';
    };

    return (
        <DashboardLayout isLoggedIn={!!user}>
            <div className="drive-management">
                <h1>Vaccination Drive Management</h1>
                
                <div className="controls">
                    <button 
                        onClick={() => setShowForm(true)}
                        className="add-button"
                    >
                        Schedule New Drive
                    </button>
                </div>

                {showForm && (
                    <div className="drive-form">
                        <h2>{formData.id ? 'Edit Drive' : 'Schedule New Drive'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Drive Name*:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.name && <span className="error">{errors.name}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label>Vaccine*:</label>
                                <select
                                    name="vaccineId"
                                    value={formData.vaccineId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Vaccine</option>
                                    {vaccines.map(vaccine => (
                                        <option key={vaccine.id} value={vaccine.id}>
                                            {vaccine.name} ({vaccine.quantity} available)
                                        </option>
                                    ))}
                                </select>
                                {errors.vaccineId && <span className="error">{errors.vaccineId}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label>Date Range*:</label>
                                <div className="date-range">
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={(e) => handleDateChange([e.target.value, formData.endDate])}
                                        min={new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0]}
                                        required
                                    />
                                    <span>to</span>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={(e) => handleDateChange([formData.startDate, e.target.value])}
                                        min={formData.startDate || new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0]}
                                        required
                                    />
                                </div>
                                {errors.startDate && <span className="error">{errors.startDate}</span>}
                                {errors.endDate && <span className="error">{errors.endDate}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label>Available Doses*:</label>
                                <input
                                    type="number"
                                    name="availableDoses"
                                    min="1"
                                    value={formData.availableDoses}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Applicable Classes*:</label>
                                <div>
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <label key={i}>
                                            <input
                                                type="checkbox"
                                                checked={formData.applicableClasses.includes(`Grade ${i+1}`)}
                                                onChange={(e) => {
                                                    const newClasses = e.target.checked
                                                        ? [...formData.applicableClasses, `Grade ${i+1}`]
                                                        : formData.applicableClasses.filter(c => c !== `Grade ${i+1}`);
                                                    handleClassSelect(newClasses);
                                                }}
                                            />
                                            Grade {i+1}
                                        </label>
                                    ))}
                                </div>
                                {errors.applicableClasses && <span className="error">{errors.applicableClasses}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label>Location*:</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.location && <span className="error">{errors.location}</span>}
                            </div>
                            
                            <div className="form-actions">
                                <button type="submit" className="save-button">
                                    {formData.id ? 'Update' : 'Save'} Drive
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setShowForm(false);
                                        setFormData({
                                            name: '',
                                            vaccineId: '',
                                            startDate: '',
                                            endDate: '',
                                            availableDoses: 0,
                                            applicableClasses: [],
                                            location: ''
                                        });
                                    }}
                                    className="cancel-button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="drives-list">
                    <h2>Scheduled Drives</h2>
                    {drives.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Drive Name</th>
                                    <th>Vaccine</th>
                                    <th>Dates</th>
                                    <th>Available Doses</th>
                                    <th>Classes</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {drives.map(drive => (
                                    <tr key={drive.id}>
                                        <td>{drive.name}</td>
                                        <td>{drive.vaccineName}</td>
                                        <td>
                                            {new Date(drive.startDate).toLocaleDateString()} - {' '}
                                            {new Date(drive.endDate).toLocaleDateString()}
                                        </td>
                                        <td>{drive.availableDoses}</td>
                                        <td>{drive.applicableClasses.join(', ')}</td>
                                        <td>{drive.location}</td>
                                        <td className={`status ${drive.status.toLowerCase()}`}>
                                            {drive.status}
                                        </td>
                                        <td>
                                            <button
                                                className={`action-button edit ${isPastOrCancelledDrive(drive) ? 'disabled' : ''}`}
                                                onClick={() => {
                                                    if (!isPastOrCancelledDrive(drive)) {
                                                        setFormData(drive);
                                                        setShowForm(true);
                                                    }
                                                }}
                                                disabled={isPastOrCancelledDrive(drive)}
                                            >
                                                Edit
                                            </button>
                                            {drive.status === 'UPCOMING' && (
                                                <button
                                                    className="action-button cancel"
                                                    onClick={() => handleCancelDrive(drive.id)}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            <button
                                                className="action-button delete"
                                                onClick={() => handleDelete(drive.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No drives scheduled yet.</p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default DriveManagement;