import React from 'react';
import Authentication from './Authentication';
import Dashboard from './Dashboard';
import UsersPage from './usersPage';
import RoomsContainer from './Rooms/RoomsContainer.jsx'

const App = () => {
  const path = window.location.pathname;

  switch (path) {
    case '/login':
      return <Authentication />;
    case '/dashboard':
      return <Dashboard />;
    case '/users':
      return <UsersPage />;
    case '/rooms':
      return <RoomsContainer />;
    default:
      window.location.href = '/login';
      return null;
  }
};

export default App;
