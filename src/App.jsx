import React from 'react';
import { BrowserRouter, Routes, Route , Navigate} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/admin/dashboard/Dashboard';
import UsersPage from './pages/admin/usersPage';
import Booking from './pages/admin/booking';
import RoomsContainer from './pages/Rooms/RoomsContainer';
import AdminProfile from './pages/Profile';
import EventsActivities from './pages/admin/EventsActivities';
import Payment from './pages/admin/Payment';
import Authentication from './pages/Authentication';
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import CheckInPage from './pages/receptionist/CheckIn';
import CheckOutPage from './pages/receptionist/CheckOut';
import ReservationManagement from './pages/receptionist/Reservation/ReservationManagement';
import Profile from './pages/receptionist/profile'; 
import HotelManagement from './pages/admin/hotelManagement'
import WalkInCheckInPage from './pages/receptionist/WalkInCheckInPage';
import TimeOffRequestsPage from './pages/admin/TimeOffRequestPage';
function App() {  
  const role = localStorage.getItem('role');
  return (
     

    <BrowserRouter>

      <Routes>

      <Route
          path="/"
          element={
            role === 'admin' ? (
              <Navigate to="/admin" replace />
            ) : role === 'receptionist' ? (
              <Navigate to="/receptionist" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute role="admin">
              <Booking />
            </ProtectedRoute>
          }
        />
         <Route
          path="/admin/timeoff"
          element={
            <ProtectedRoute role="admin">
              <TimeOffRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rooms"
          element={
            <ProtectedRoute role="admin">
              <RoomsContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hotel"
          element={
            <ProtectedRoute role="admin">
              <HotelManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute role="admin">
              <EventsActivities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payment"
          element={
            <ProtectedRoute role="admin">
              <Payment />
            </ProtectedRoute>
          }
        />

        {/* Receptionist Routes */}
        <Route
          path="/receptionist"
          element={
            <ProtectedRoute>
              <ReceptionistDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receptionist/bookings"
          element={
            <ProtectedRoute role="receptionist">
              <ReservationManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receptionist/checkin"
          element={
            <ProtectedRoute role="receptionist">
              <CheckInPage />
            </ProtectedRoute>
          }
        />
         <Route
          path="/receptionist/walkincheckin"
          element={
            <ProtectedRoute role="receptionist">
              <WalkInCheckInPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/receptionist/checkout"
          element={
            <ProtectedRoute role="receptionist">
              <CheckOutPage />
            </ProtectedRoute>
          }
        />
         <Route
          path="/receptionist/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Authentication Routes */}
        <Route path="/login" element={<Authentication />} />
        <Route path="/register" element={<Authentication />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;