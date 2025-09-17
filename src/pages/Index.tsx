import React, { useState } from 'react';
import Login from '../components/Login';
import GuardInterfaceWorking from '../components/GuardInterfaceWorking';
import AdminDashboard from '../components/AdminDashboard';

const Index: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<'guard' | 'admin' | null>(null);

  const handleLogin = (userType: 'guard' | 'admin') => {
    setCurrentUser(userType);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentUser === 'guard') {
    return <GuardInterfaceWorking onLogout={handleLogout} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
};

export default Index;