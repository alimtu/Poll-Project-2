import { useMutation } from '@tanstack/react-query';
import http from '../axios';

/**
 * Transforms react-hook-form values into the API format:
 *   f_{sectionId}_{rowIndex} = value
 *
 * Non-repeatable step (numrow=1): row index is always 0.
 * Repeatable step (numrow>1): each filled row gets its own index.
 */
function buildSubmitParams(values, steps, formId) {
  const params = { op: 'm_sendform', formId };

  for (const step of steps) {
    const sections = step.sections || [];

    if (step.numrow > 1) {
      const rows = values[`rows_${step.stepId}`] || [];
      rows.forEach((row, ri) => {
        if (!row) return;
        const hasAnyValue = sections.some(
          (s) => row[`section_${s.sectionId}`] != null && row[`section_${s.sectionId}`] !== '',
        );
        if (!hasAnyValue) return;

        for (const section of sections) {
          const raw = row[`section_${section.sectionId}`];
          const val = serializeValue(raw, section.type);
          if (val !== undefined) params[`f_${section.sectionId}_${ri}`] = val;
        }
      });
    } else {
      for (const section of sections) {
        const raw = values[`section_${section.sectionId}`];
        const val = serializeValue(raw, section.type);
        if (val !== undefined) params[`f_${section.sectionId}_0`] = val;
      }
    }
  }

  return params;
}

function serializeValue(raw, type) {
  if (raw == null || raw === '') return undefined;

  if (type === 5 && Array.isArray(raw)) {
    return raw.length ? raw.join(',') : undefined;
  }

  if (type === 10 && typeof raw === 'object') {
    return raw.sub || undefined;
  }

  return String(raw);
}

export default function useSubmitForm() {
  return useMutation({
    mutationFn: ({ values, steps, formId, location }) => {
      const params = buildSubmitParams(values, steps, formId);

      if (location) {
        params.lat = location.lat;
        params.lng = location.lng;
      }

      return http.get('/', { params });
    },
  });
}
