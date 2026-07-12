
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../services/api'; // Your Axios instance

export const useAssets = () => {
  return useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const response = await api.get('/assets');
      return response.data;
    },
  });
};
