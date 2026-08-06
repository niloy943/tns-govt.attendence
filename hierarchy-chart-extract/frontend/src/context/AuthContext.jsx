import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Standalone filter and selection state for demo dashboard view
  const [selectedMinistryId, setSelectedMinistryId] = useState("all");
  
  const currentUser = {
    id: 1,
    name: "Tariqul Islam",
    role: "super_admin",
    ministryId: 1
  };

  return (
    <AuthContext.Provider value={{
      selectedMinistryId,
      setSelectedMinistryId,
      currentUser,
      isAuthenticated: true,
      loading: false,
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
