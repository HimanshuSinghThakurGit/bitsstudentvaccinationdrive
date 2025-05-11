import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../Layout/DashboardLayout';
import axios from 'axios';
import '../styles/StudentManagement.css';

function StudentManagement() {
    const { user } = useContext(AuthContext);
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [filters, setFilters] = useState({
        class: '',
        vaccinationStatus: ''
    });
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        studentId: '',
        name: '',
        classGrade: '',
        vaccinationStatus: '',
        vaccineType: '',
        lastVaccinatedDate: ''
    });
    // New state for view and edit
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editStudentId, setEditStudentId] = useState(null);

    // Fetch students on component mount
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('/api/students');
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                studentId: formData.studentId,
                name: formData.name,
                classGrade: formData.classGrade,
                vaccinationStatus: formData.vaccinationStatus
            };
            if (formData.vaccineType) payload.vaccineType = formData.vaccineType;
            if (formData.lastVaccinatedDate) payload.lastVaccinatedDate = formData.lastVaccinatedDate;

            if (isEditing) {
                // Update existing student
                await axios.put(`/api/students/${editStudentId}`, payload);
                setIsEditing(false);
                setEditStudentId(null);
            } else {
                // Create new student
                await axios.post('/api/students', payload);
            }
            fetchStudents();
            resetForm();
            setShowAddForm(false);
            alert(isEditing ? 'Student updated successfully!' : 'Student saved successfully!');
        } catch (error) {
            console.error(isEditing ? 'Error updating student:' : 'Error saving student:', error);
            alert(`Failed to ${isEditing ? 'update' : 'save'} student: ${error.response?.data?.message || error.message}`);
        }
    };

    const resetForm = () => {
        setFormData({
            studentId: '',
            name: '',
            classGrade: '',
            vaccinationStatus: '',
            vaccineType: '',
            lastVaccinatedDate: ''
        });
        setIsEditing(false);
        setEditStudentId(null);
    };

    const handleView = (student) => {
        setSelectedStudent(student);
        setShowViewModal(true);
    };

    const handleEdit = (student) => {
        setFormData({
            studentId: student.studentId,
            name: student.name,
            classGrade: student.classGrade,
            vaccinationStatus: student.vaccinationStatus,
            vaccineType: student.vaccineType || '',
        });
        setIsEditing(true);
        setEditStudentId(student.id);
        setShowAddForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await axios.delete(`/api/students/${id}`);
                fetchStudents();
                alert('Student deleted successfully!');
            } catch (error) {
                console.error('Error deleting student:', error);
                alert(`Failed to delete student: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('/api/students/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchStudents();
            alert('Students uploaded successfully!');
        } catch (error) {
            console.error('Error uploading CSV:', error);            
            alert('Error uploading file. Please check the format and try again.There may be duplicate entry');
            fetchStudents();
        }
    };




    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId.includes(searchTerm);

        const matchesClass = filters.class ? student.classGrade === filters.class : true;
        const matchesStatus = filters.vaccinationStatus ?
            student.vaccinationStatus === filters.vaccinationStatus : true;

        return matchesSearch && matchesClass && matchesStatus;
    });

    return (
        <DashboardLayout isLoggedIn={!!user}>
            <div className="student-management">
                <h1>Student Management</h1>

                {/* Search and Filter Bar */}
                <div className="controls">
                    <div className="search-filter">
                        <input
                            type="text"
                            placeholder="Search by name or student ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            name="class"
                            value={filters.class}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Classes</option>
                            <option value="Grade 1">Class 1</option>
                            <option value="Grade 2">Class 2</option>
                            <option value="Grade 3">Class 3</option>
                            <option value="Grade 4">Class 4</option>
                            <option value="Grade 5">Class 5</option>
                            <option value="Grade 6">Class 6</option>
                            <option value="Grade 7">Class 7</option>
                            <option value="Grade 8">Class 8</option>
                            <option value="Grade 9">Class 9</option>
                            <option value="Grade 10">Class 10</option>
                        </select>
                        <select
                            name="vaccinationStatus"
                            value={filters.vaccinationStatus}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Statuses</option>
                            <option value="true">Vaccinated</option>
                            <option value="false">Not Vaccinated</option>
                        </select>
                    </div>
                    <div className="actions">
                        <button
                            onClick={() => {
                                resetForm();
                                setShowAddForm(!showAddForm);
                            }}
                            className="add-button"
                        >
                            {showAddForm ? 'Cancel' : 'Add New Student'}
                        </button>
                        <div className="bulk-upload">
                            <a
                                href="/templates/student_upload_template.csv"
                                download
                                className="upload-button"
                                style={{ marginRight: '10px' }}
                            >
                                Download Template
                            </a>
                            <label htmlFor="csv-upload" className="upload-button">
                                Bulk Upload CSV
                            </label>
                            <input
                                id="csv-upload"
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                            />
                        </div>                

                    </div>
                </div>

                {/* Add/Edit Student Form */}
                {showAddForm && (
                    <div className="student-form">
                        <h2>{isEditing ? 'Edit Student' : 'Add New Student'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Student ID:</label>
                                <input
                                    type="text"
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Class:</label>
                                <select
                                    name="classGrade"
                                    value={formData.classGrade}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Class</option>
                                    <option value="Grade 1">Class 1</option>
                                    <option value="Grade 2">Class 2</option>
                                    <option value="Grade 3">Class 3</option>
                                    <option value="Grade 4">Class 4</option>
                                    <option value="Grade 5">Class 5</option>
                                    <option value="Grade 6">Class 6</option>
                                    <option value="Grade 7">Class 7</option>
                                    <option value="Grade 8">Class 8</option>
                                    <option value="Grade 9">Class 9</option>
                                    <option value="Grade 10">Class 10</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Vaccination Status:</label>
                                <select
                                    name="vaccinationStatus"
                                    value={formData.vaccinationStatus}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="false">Not Vaccinated</option>
                                    <option value="true">Vaccinated</option>
                                </select>
                            </div>
                         
                            <div className="form-buttons">
                                <button type="submit" className="save-button">
                                    {isEditing ? 'Update Student' : 'Save Student'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setShowAddForm(false);
                                    }}
                                    className="cancel-button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Students List */}
                <div className="students-list">
                    <h2>Student Records</h2>
                    {filteredStudents.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Name</th>
                                    <th>Class</th>
                                    <th>Vaccination Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map(student => (
                                    <tr key={student.id}>
                                        <td>{student.studentId}</td>
                                        <td>{student.name}</td>
                                        <td>{student.classGrade}</td>
                                    
                                        <td className={`status ${student.vaccinationStatus === 'true' ? 'vaccinated' : 'not-vaccinated'}`}
                                            style={{ color: student.vaccinationStatus === 'true' ? 'green' : 'red' }}>
                                            {student.vaccinationStatus === 'true' ? 'Vaccinated' : 'Not Vaccinated'}
                                        </td>
                                        <td>
                                            
                                            <button
                                                className="action-button"
                                                onClick={() => handleEdit(student)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="action-button delete-button"
                                                onClick={() => handleDelete(student.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No students found matching your criteria.</p>
                    )}
                </div>

                {/* View Student Modal */}
                {showViewModal && selectedStudent && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Student Details</h2>
                            <p><strong>Student ID:</strong> {selectedStudent.studentId}</p>
                            <p><strong>Name:</strong> {selectedStudent.name}</p>
                            <p><strong>Class:</strong> {selectedStudent.classGrade}</p>
                            <p><strong>Vaccination Status:</strong> {selectedStudent.vaccinationStatus}</p>
                            <p><strong>Vaccine Type:</strong> {selectedStudent.vaccineType || 'N/A'}</p>

                            <button
                                className="close-button"
                                onClick={() => setShowViewModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default StudentManagement;