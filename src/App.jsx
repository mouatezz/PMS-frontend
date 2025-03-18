import React from 'react';
import Authentication from './Authentication';
import Dashboard from './Dashboard';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import UsersPage from './usersPage';
import Booking from './booking'
import RoomsContainer from './Rooms/RoomsContainer.jsx'
import AdminProfile from './AdminProfile.jsx'
import EventsActivities from './EventsActivities.jsx'
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