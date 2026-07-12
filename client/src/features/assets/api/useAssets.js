import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';

// Existing GET hook
export const useAssets = () => {
  return useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const response = await api.get('/assets');
      return response.data;
    },
  });
};

// NEW: POST hook for creating assets
export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newAsset) => {
      const response = await api.post('/assets', newAsset);
      return response.data;
    },
    onSuccess: () => {
      // This tells React Query to refetch the 'assets' list automatically
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
};
