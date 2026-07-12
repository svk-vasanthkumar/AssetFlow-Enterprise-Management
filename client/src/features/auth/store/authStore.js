import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,         // e.g., { id: 1, name: 'John Doe', role: 'Admin' }
  accessToken: null,  // The JWT for API requests
  isAuthenticated: false,

  // Called after a successful login or silent refresh
  setCredentials: (user, accessToken) => 
    set({ user, accessToken, isAuthenticated: true }),

  // Called on explicit logout or when refresh token expires
  logout: () => 
    set({ user: null, accessToken: null, isAuthenticated: false }),
}));
