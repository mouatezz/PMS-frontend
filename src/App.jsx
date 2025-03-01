import React from 'react';
import Authentication from './Authentication';
import Dashboard from './Dashboard';

const App = () => {
  const path = window.location.pathname;

  switch (path) {
    case '/login':
      return <Authentication />;
    case '/dashboard':
      return <Dashboard />;
    default:
      window.location.href = '/login';
      return <div>Redirecting to login...</div>;
  }
};

export default App;