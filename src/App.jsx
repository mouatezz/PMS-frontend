import React from 'react';
import Authentication from './pages/Authentication';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import UsersPage from './pages/usersPage.jsx';
import Booking from './pages/booking.jsx'
import RoomsContainer from './pages/Rooms/RoomsContainer.jsx'
import AdminProfile from './pages/AdminProfile.jsx'
import EventsActivities from './pages/EventsActivities.jsx'
  function App() {

    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
              <ProtectedRoute>  <Dashboard /> </ProtectedRoute>
            } />
        
          <Route path="/users" element={
             <ProtectedRoute><UsersPage /></ProtectedRoute>
            }
          />
          <Route path="/bookings" element={
           <Booking />
           }
         />
          <Route path="/rooms" element={
           <RoomsContainer />
           }
         />
         
          <Route path="/profile" element={
           <AdminProfile />
           }
         />
          <Route path="/events" element={
           <EventsActivities />
           }
         />
          <Route path="/login" element={<Authentication />} />
          <Route path="/register" element={<Authentication />} />
        
        </Routes>
      </BrowserRouter>
    )
  }
export default App;