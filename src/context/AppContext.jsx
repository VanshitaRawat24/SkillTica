import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);
const API_BASE = 'http://localhost:3001/api';

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [employees, setEmployees] = useState([]);

  // Data Normalization Layer (Step 1 of HR Integration Roadmap)
  const normalizeEmployeeData = (raw) => {
    // Safely parse JSON sections
    const parse = (str) => {
      try { return (str && typeof str === 'string') ? JSON.parse(str) : (str || {}); } 
      catch (e) { return {}; }
    };

    const personal = parse(raw.personal);
    const experience = parse(raw.experience);
    const behavioral = parse(raw.behavioral);

    return {
      ...raw,
      personal,
      experience,
      behavioral,
      // Mapping to UI property names
      profileCompletion: raw.completionPct || 0,
      department: experience.department || personal.department || 'Engineering',
      currentRole: experience.currentRole || raw.currentRole || 'Employee',
      yearsExperience: parseInt(experience.years) || 0,
      riskLevel: raw.riskLevel || 'low', // default until AI analysis is integrated
      behavioralScore: raw.score || 85,
      highPotential: (raw.score > 80 || raw.completionPct > 70),
      promotionReady: (parseInt(experience.years) >= 2 && raw.score > 75),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${raw.name || 'default'}`,
      roleFitScores: { 
        'Product Manager': 65, 
        'Software Engineer': 85, 
        'UX Designer': 40 
      } // simulated for now
    };
  };

  // Fetch HR data
  const fetchAllEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/employees`);
      const data = await res.json();
      
      // Map raw backend data to HR UI components via Normalization Layer
      const normalized = Array.isArray(data.employees) 
        ? data.employees.map(normalizeEmployeeData) 
        : (Array.isArray(data) ? data.map(normalizeEmployeeData) : []);

      setEmployees(normalized);
    } catch (e) {
      console.error('Fetch Employees Error:', e);
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
      
      if (resData.success) {
        // Refresh local user
        const profRes = await fetch(`${API_BASE}/profile/${currentUser.id}`);
        const profile = await profRes.json();
        setCurrentUser({ ...currentUser, ...profile });
      }
    } catch (e) {
      console.error('Failed to update section', e);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, currentRole, employees, 
      login, register, logout, updateProfileSection, fetchAllEmployees 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
