import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser, getMe } from '../api/endpoints/auth';

const AuthContext = createContext(null);

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === "true";

export const mockUsers = [
  {
    id: 1,
    name: "Tariqul Islam",
    email: "superadmin@tns.gov.bd", // Updated to match backend seeder
    role: "super_admin",
    roleLabel: "Super Admin",
    ministryId: 1,
    ministryName: "Ministry of Social Welfare",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    email: "admin.mof@tns.gov.bd", // Updated to match backend seeder
    role: "ministry_admin",
    roleLabel: "Ministry Branch Manager",
    ministryId: 1,
    ministryName: "Ministry of Finance",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Anisur Rahman",
    email: "anisur.rahman@socialwelfare.gov.bd",
    role: "employee",
    roleLabel: "Senior Officer",
    ministryId: 1,
    ministryName: "Ministry of Social Welfare",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
  }
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 2-tier view state: 'central' | 'ministry'
  const [viewLevel, setViewLevel] = useState('central');
  const [selectedMinistryId, setSelectedMinistryId] = useState("all");

  // Restore session on load
  useEffect(() => {
    async function restoreSession() {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken) {
        if (USE_DUMMY) {
          if (storedUser) {
            try {
              setCurrentUser(JSON.parse(storedUser));
            } catch (e) {
              localStorage.removeItem('user');
            }
          }
        } else {
          try {
            const user = await getMe();
            // Transform backend role to match frontend expectations
            const mappedUser = {
              ...user,
              roleLabel: user.role === 'super_admin' ? 'Super Admin' : user.role === 'ministry_admin' ? 'Ministry Branch Manager' : 'Government Officer',
              avatar: user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
            };
            setCurrentUser(mappedUser);
            localStorage.setItem('user', JSON.stringify(mappedUser));
          } catch (error) {
            console.error("Failed to restore backend session:", error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      }
      setLoading(false);
    }
    restoreSession();
  }, []);

  const login = async (email, password) => {
    if (USE_DUMMY) {
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user && password === 'password') {
        setCurrentUser(user);
        localStorage.setItem('token', 'dummy-gov-jwt-token');
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
      throw new Error("The provided credentials are incorrect.");
    } else {
      const response = await loginUser(email, password);
      const { token, user } = response;
      
      const mappedUser = {
        ...user,
        roleLabel: user.role === 'super_admin' ? 'Super Admin' : user.role === 'ministry_admin' ? 'Ministry Branch Manager' : 'Government Officer',
        avatar: user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(mappedUser));
      setCurrentUser(mappedUser);
      return mappedUser;
    }
  };

  const logout = async () => {
    if (!USE_DUMMY) {
      try {
        await logoutUser();
      } catch (error) {
        console.error("Backend logout failed:", error);
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const setCentralView = () => {
    setViewLevel('central');
    setSelectedMinistryId('all');
  };

  const setMinistryView = (ministryId) => {
    setViewLevel('ministry');
    setSelectedMinistryId(ministryId || 1);
  };

  const selectMinistry = (ministryId) => {
    if (ministryId === 'all') {
      setCentralView();
    } else {
      setMinistryView(ministryId);
    }
  };

  const switchUser = (userId) => {
    const target = mockUsers.find(u => u.id === Number(userId));
    if (target) {
      setCurrentUser(target);
      localStorage.setItem('user', JSON.stringify(target));
    }
  };

  const hasRole = (roles) => {
    if (!currentUser) return false;
    if (Array.isArray(roles)) {
      return roles.includes(currentUser.role);
    }
    return currentUser.role === roles;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: !!currentUser,
      loading,
      login,
      logout,
      mockUsers,
      switchUser,
      hasRole,
      viewLevel,
      setViewLevel,
      selectedMinistryId,
      setSelectedMinistryId,
      selectMinistry,
      setCentralView,
      setMinistryView
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
