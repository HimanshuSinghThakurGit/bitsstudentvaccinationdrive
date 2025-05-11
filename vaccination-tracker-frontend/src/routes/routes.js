import React from 'react';
import { Route } from 'react-router-dom';
import Home from '../Layout/Home';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import Students from '../components/Students';
import Drives from '../components/Drives';
import { ProtectedRoute } from '../components/ProtectedRoute';
import NotFound from '../Layout/NotFound';
import VaccineInventory from '../components/VaccineInventory';
import ConductVaccinationDrive from '../components/ConductVaccinationDrive';
const routes = [
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/students',
    element: (
      <ProtectedRoute>
        <Students />
      </ProtectedRoute>
    ),
  },
  {
    path: '/drives',
    element: (
      <ProtectedRoute>
        <Drives />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vaccines',
    element: (
      <ProtectedRoute>
        <VaccineInventory/>
      </ProtectedRoute>
    ),
  },
  {
    path: '/vaccinedrive',
    element: (
      <ProtectedRoute>
        <ConductVaccinationDrive />
      </ProtectedRoute>
    ),
  },
  { path: '*', element: <NotFound /> }
];

export default routes;
