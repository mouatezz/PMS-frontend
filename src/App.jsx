import React from 'react';
import Authentication from './Authentication';
import Dashboard from './Dashboard';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import UsersPage from './usersPage';

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
          <Route path="/login" element={<Authentication />} />
          <Route path="/register" element={<Authentication />} />
        
        </Routes>
      </BrowserRouter>
    )
  }
export default App;