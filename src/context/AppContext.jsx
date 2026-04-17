import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);
const API_BASE = 'http://localhost:3001/api';

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('skilltica_token'));

  // Helper for authenticated fetches
  const authFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return fetch(url, { ...options, headers });
  };

  // Data Normalization Layer
  const normalizeEmployeeData = (raw) => {
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
      profileCompletion: raw.completionPct || 0,
      department: experience.department || personal.department || 'Engineering',
      currentRole: experience.currentRole || raw.currentRole || 'Employee',
      yearsExperience: parseInt(experience.years) || 0,
      riskLevel: raw.riskLevel || 'low',
      behavioralScore: raw.score || 85,
      highPotential: (raw.score > 80 || raw.completionPct > 70),
      promotionReady: (parseInt(experience.years) >= 2 && raw.score > 75),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${raw.name || 'default'}`,
      roleFitScores: { 
        'Product Manager': 65, 
        'Software Engineer': 85, 
        'UX Designer': 40 
      }
    };
  };

  // Fetch HR data
  const fetchAllEmployees = async () => {
    try {
      const res = await authFetch(`${API_BASE}/admin/employees`);
      const data = await res.json();
      
      const normalized = Array.isArray(data.employees) 
        ? data.employees.map(normalizeEmployeeData) 
        : (Array.isArray(data) ? data.map(normalizeEmployeeData) : []);

      setEmployees(normalized);
    } catch (e) {
      console.error('Fetch Employees Error:', e);
    }
  };

  // Restore session
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem('skilltica_token');
      const savedUser = localStorage.getItem('skilltica_user');
      
      if (savedToken && savedUser) {
        setToken(savedToken);
        const user = JSON.parse(savedUser);
        setCurrentRole(user.role);
        
        // Refresh profile data
        try {
          if (user.role === 'employee') {
            const res = await fetch(`${API_BASE}/profile/${user.id}`, {
              headers: { 'Authorization': `Bearer ${savedToken}` }
            });
            if (res.ok) {
              const profile = await res.json();
              setCurrentUser({ ...user, ...profile });
            } else {
              logout();
            }
          } else {
            setCurrentUser(user);
            // Initial fetch if HR
            const empRes = await fetch(`${API_BASE}/admin/employees`, {
              headers: { 'Authorization': `Bearer ${savedToken}` }
            });
            const empData = await empRes.json();
            const normalized = Array.isArray(empData.employees) 
                ? empData.employees.map(normalizeEmployeeData) 
                : (Array.isArray(empData) ? empData.map(normalizeEmployeeData) : []);
            setEmployees(normalized);
          }
        } catch (e) {
          console.error('Session restoration failed', e);
        }
      }
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.error) return { error: data.error };
      
      setToken(data.token);
      setCurrentRole(data.user.role);
      localStorage.setItem('skilltica_token', data.token);
      localStorage.setItem('skilltica_user', JSON.stringify(data.user));
      
      if (data.user.role === 'employee') {
        const profRes = await fetch(`${API_BASE}/profile/${data.user.id}`, {
          headers: { 'Authorization': `Bearer ${data.token}` }
        });
        const profile = await profRes.json();
        setCurrentUser({ ...data.user, ...profile });
      } else {
        setCurrentUser(data.user);
        // Trigger initial fetch for HR
        setTimeout(fetchAllEmployees, 100);
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
      
      // Auto-login after registration
      return login(email, password);
    } catch (e) {
      return { error: 'Network error' };
    }
  };

  const updateProfileSection = async (section, data) => {
    if (!currentUser || currentRole !== 'employee') return;
    try {
      const res = await authFetch(`${API_BASE}/profile/${currentUser.id}/${section}`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      
      if (resData.success) {
        const profRes = await authFetch(`${API_BASE}/profile/${currentUser.id}`);
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
    setToken(null);
    localStorage.removeItem('skilltica_token');
    localStorage.removeItem('skilltica_user');
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, currentRole, employees, token,
      login, register, logout, updateProfileSection, fetchAllEmployees 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
