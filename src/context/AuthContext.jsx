import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const mockUsers = [
  {
    id: 1,
    name: "Tariqul Islam",
    email: "tariqul.islam@socialwelfare.gov.bd",
    role: "super_admin",
    roleLabel: "Super Admin",
    ministryId: 1,
    ministryName: "Ministry of Social Welfare",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    email: "nusrat.jahan@mowca.gov.bd",
    role: "ministry_admin",
    roleLabel: "Ministry Branch Manager",
    ministryId: 2,
    ministryName: "Ministry of Women and Children Affairs",
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
  const [currentUser, setCurrentUser] = useState(mockUsers[0]);

  const switchUser = (userId) => {
    const target = mockUsers.find(u => u.id === Number(userId));
    if (target) {
      setCurrentUser(target);
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
    <AuthContext.Provider value={{ currentUser, mockUsers, switchUser, hasRole }}>
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
