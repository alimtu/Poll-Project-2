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
      return http.get('/', {
        params: { op },
        signal,
        _skipStatusCheck: op === 'm_version', // m_version returns raw { version, logo, name, images }
      });
    },
    enabled: !!op,
    ...options,
  });
}
