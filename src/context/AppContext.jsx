import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);
const API_BASE = 'http://localhost:3001/api';

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [employees, setEmployees] = useState([]);

  // Fetch HR data
  const fetchAllEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/employees`);
      const data = await res.json();
      setEmployees(data);
    } catch (e) {
      console.error(e);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.error) return { error: data.error };
      
      setCurrentRole(data.user.role);
      
      if (data.user.role === 'employee') {
        const profRes = await fetch(`${API_BASE}/profile/${data.user.id}`);
        const profile = await profRes.json();
        setCurrentUser({ ...data.user, ...profile });
      } else {
        setCurrentUser(data.user);
        fetchAllEmployees();
      }
      return { success: true };
    } catch (e) {
      return { error: 'Network error' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'employee' })
      });
      const data = await res.json();
      if (data.error) return { error: data.error };
      return login(email, password);
    } catch (e) {
      return { error: 'Network error' };
    }
  };

  const updateProfileSection = async (section, data) => {
    if (!currentUser || currentRole !== 'employee') return;
    try {
      const res = await fetch(`${API_BASE}/profile/${currentUser.id}/${section}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      
    