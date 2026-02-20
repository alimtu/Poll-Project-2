import { useQuery } from '@tanstack/react-query';
import http from '../axios';

/**
 * Hook to fetch form data.
 * @param {string} op - Operation name (e.g., 'm_forms')
 * @param {object} options - React Query options
 */
export default function useFormData(op, options = {}) {
  return useQuery({
    queryKey: ['form-data', op],
    queryFn: async ({ signal }) => {
      // The finger, name=Icms, and file=json are automatically 
      // added by the axios interceptor in src/lib/axios/index.js
      return http.get('/', {
        params: { op },
        signal,
      });
    },
    enabled: !!op,
    ...options,
  });
}

