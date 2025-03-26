import React from 'react';
import Authentication from './Authentication';
import Dashboard from './dashboard/Dashboard.jsx';
import UsersPage from './usersPage';
import RoomsContainer from './Rooms/RoomsContainer.jsx';
import AdminProfile from './AdminProfile';
import EventsActivities from './EventsActivities';

const App = () => {
  const path = window.location.pathname;

  switch (path) {
    case '/':
      return <Dashboard />;
    case '/login':
      return <Authentication />;
    case '/dashboard':
      return <Dashboard />;
    case '/users':
      return <UsersPage />;
    case '/rooms':
      return <RoomsContainer />;
    case '/admin-profile':
      return <AdminProfile />;
    case '/events-activities':
      return <EventsActivities />;
    default:
      window.location.href = '/';
      return null;
  }
};

export default App;