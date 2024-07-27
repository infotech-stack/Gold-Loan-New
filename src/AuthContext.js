import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminId, setAdminId] = useState('');

  useEffect(() => {
    const storedPermissions = Cookies.get('permissions');
    const storedIsAuthenticated = Cookies.get('isAuthenticated');
    const storedAdminId = Cookies.get('adminId');

    if (storedPermissions && storedIsAuthenticated && storedAdminId) {
      setPermissions(JSON.parse(storedPermissions));
      setIsAuthenticated(storedIsAuthenticated === 'true');
      setAdminId(storedAdminId);
    }
  }, []);

  const login = async (adminId, password) => {
    const rootAdminId = 'rootadmin';
    const rootAdminPassword = 'rootpassword123';

    if (adminId === rootAdminId && password === rootAdminPassword) {
      const rootPermissions = ['Dashboard', 'Master', 'Customer', 'Adagu', 'Repledge', 'Expenses', 'Reminders', 'Books', 'Tools', 'Added Admin','Added Root','Branch Management','Root Management','Report','Voucher','Admin Management','Loan Retrieved'];
      setPermissions(rootPermissions);
      setIsAuthenticated(true);
      setAdminId(adminId);
      Cookies.set('permissions', JSON.stringify(rootPermissions));
      Cookies.set('isAuthenticated', 'true');
      Cookies.set('adminId', adminId);
      return true;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/admins/login', { adminId, password });

      if (response.data.success) {
        const permissionsResponse = await axios.get(`http://localhost:5000/api/admins/${adminId}/permissions`);
        const { permissions } = permissionsResponse.data;
        setPermissions(permissions);
        setIsAuthenticated(true);
        setAdminId(adminId);
        Cookies.set('permissions', JSON.stringify(permissions));
        Cookies.set('isAuthenticated', 'true');
        Cookies.set('adminId', adminId);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setPermissions([]);
    setIsAuthenticated(false);
    setAdminId('');
    Cookies.remove('permissions');
    Cookies.remove('isAuthenticated');
    Cookies.remove('adminId');
  };

  return (
    <AuthContext.Provider value={{ permissions, isAuthenticated, login, logout, adminId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
