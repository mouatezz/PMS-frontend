import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Authentication from './Authentication';
import Dashboard from './dashboard/Dashboard.jsx';
import UsersPage from './usersPage';
import AdminProfile from './AdminProfile';
import EventsActivities from './EventsActivities';
import ReceptionistDashboard from './receptionist/ReceptionistDashboard';
import ReservationManagement from './receptionist/Reservation/ReservationManagement';
import CheckIn from './receptionist/CheckIn';
import CheckOut from './receptionist/CheckOut';
import RoomsContainer from './Rooms/RoomsContainer';

const App = () => {
  const userRole = localStorage.getItem('userRole');

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!userRole) {
      return <Navigate to="/login" replace />;
    }
    
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
    
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Authentication />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
              {userRole === 'admin' ? <Dashboard /> : <ReceptionistDashboard />}
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/rooms" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
              <RoomsContainer />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/events-activities" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EventsActivities />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/users" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UsersPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin-profile" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProfile />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/reservations" 
          element={
            <ProtectedRoute allowedRoles={['receptionist']}>
              <ReservationManagement />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/check-in" 
          element={
            <ProtectedRoute allowedRoles={['receptionist']}>
              <CheckIn />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/check-out" 
          element={
            <ProtectedRoute allowedRoles={['receptionist']}>
              <CheckOut />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
