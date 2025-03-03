import React from 'react';
import Authentication from './Authentication';
import Dashboard from './Dashboard';
import UsersPage from './usersPage';

const App = () => {
  const path = window.location.pathname;

  switch (path) {
    case '/login':
      return <Authentication />;
    case '/dashboard':
      return <Dashboard />;
    case '/users':
      return <UsersPage />;
    default:
      window.location.href = '/login';
      return <div>Redirecting to login...</div>;
  }
};

export default App;