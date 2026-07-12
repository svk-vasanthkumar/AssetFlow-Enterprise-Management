import { api } from '@/services/api'; // Your global Axios instance

export const loginUser = async (credentials) => {
  // Sends { email, password } to the backend
  const response = await api.post('/auth/login', credentials);
  return response.data; // Expecting { user, accessToken }
};

export const logoutUser = async () => {
  // Tells the backend to clear the HTTP-only refresh cookie
  await api.post('/auth/logout'); 
};
