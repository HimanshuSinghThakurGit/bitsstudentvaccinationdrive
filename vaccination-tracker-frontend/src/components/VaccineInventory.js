import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../Layout/DashboardLayout';
import axios from 'axios';
import '../styles/VaccineManagement.css';

function VaccineInventory() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [vaccines, setVaccines] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        quantity: 0,
        batchNumber: '',
        description: '',
        year: new Date().getFullYear(),
        manufacturer: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchVaccines();
    }, []);

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
            [name]: name === 'quantity' || name === 'year' 
                ? parseInt(value) || 0 
                : value 
        }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Vaccine name is required';
        if (formData.quantity < 0) newErrors.quantity = 'Quantity cannot be negative';
        if (!formData.batchNumber.trim()) newErrors.batchNumber = 'Batch number is required';
        if (formData.year < 2000 || formData.year > new Date().getFullYear() + 1) {
            newErrors.year = 'Invalid year';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        try {
            const method = formData.id ? 'put' : 'post';
            const url = formData.id ? `/api/vaccines/${formData.id}` : '/api/vaccines';
            
            await axios[method](url, formData);
            fetchVaccines();
            setShowAddForm(false);
            setFormData({
                name: '',
                quantity: 0,
                batchNumber: '',
                description: '',
                year: new Date().getFullYear(),
                manufacturer: ''
            });
            alert(`Vaccine ${formData.id ? 'updated' : 'added'} successfully!`);
        } catch (error) {
            console.error('Error saving vaccine:', error);
            alert('Failed to save vaccine');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this vaccine?')) {
            try {
                await axios.delete(`/api/vaccines/${id}`);
                fetchVaccines();
                alert('Vaccine deleted successfully');
            } catch (error) {
                console.error('Error deleting vaccine:', error);
                alert('Failed to delete vaccine');
            }
        }
    };

    const filteredVaccines = vaccines.filter(vaccine => 
        vaccine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vaccine.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout isLoggedIn={!!user}>
            <div className="vaccine-management">
                <h1>Vaccine Inventory Management</h1>
                
                <div className="controls">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by name or batch number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="actions">
                        <button 
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="add-button"
                        >
                            {showAddForm ? 'Cancel' : 'Add New Vaccine'}
                        </button>
                    </div>
                </div>

                {showAddForm && (
                    <div className="vaccine-form">
                        <h2>{formData.id ? 'Edit Vaccine' : 'Add New Vaccine'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Vaccine Name*:</label>
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
                                <label>Batch Number*:</label>
                                <input
                                    type="text"
                                    name="batchNumber"
                                    value={formData.batchNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.batchNumber && <span className="error">{errors.batchNumber}</span>}
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Quantity*:</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        min="0"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.quantity && <span className="error">{errors.quantity}</span>}
                                </div>
                                
                                <div className="form-group">
                                    <label>Year*:</label>
                                    <input
                                        type="number"
                                        name="year"
                                        min="2000"
                                        max={new Date().getFullYear() + 1}
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.year && <span className="error">{errors.year}</span>}
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Manufacturer:</label>
                                <input
                                    type="text"
                                    name="manufacturer"
                                    value={formData.manufacturer}
                                    onChange={handleInputChange}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                />
                            </div>
                            
                            <div className="form-actions">
                                <button type="submit" className="save-button">
                                    {formData.id ? 'Update' : 'Save'} Vaccine
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setShowAddForm(false)}
                                    className="cancel-button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="vaccines-list">
                    <h2>Vaccine Inventory</h2>
                    {filteredVaccines.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Batch No.</th>
                                    <th>Quantity</th>
                                    <th>Year</th>
                                    <th>Manufacturer</th>
                                    {/* <th>Last Updated</th> */}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVaccines.map(vaccine => (
                                    <tr key={vaccine.id}>
                                        <td>{vaccine.name}</td>
                                        <td>{vaccine.batchNumber}</td>
                                        <td>{vaccine.quantity}</td>
                                        <td>{vaccine.year}</td>
                                        <td>{vaccine.manufacturer || '-'}</td>
                                        {/* <td>{new Date(vaccine.updatedAt).toLocaleDateString()}</td> */}
                                        <td>
                                            <button 
                                                className="action-button edit"
                                                onClick={() => {
                                                    setFormData(vaccine);
                                                    setShowAddForm(true);
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="action-button delete"
                                                onClick={() => handleDelete(vaccine.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No vaccines found matching your criteria.</p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default VaccineInventory;