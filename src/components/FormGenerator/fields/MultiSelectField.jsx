'use client';

import { Controller } from 'react-hook-form';
import { Label } from '../../ui/label';
import { Checkbox } from '../../ui/checkbox';

export default function MultiSelectField({ name, control, section }) {
  const options = section.options || {};
  const entries = Array.isArray(options)
    ? options.map((label, i) => [String(i), label])
    : Object.entries(options);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field, fieldState }) => {
        const selected = field.value || [];

        const toggle = (key) => {
          const next = selected.includes(key)
            ? selected.filter((k) => k !== key)
            : [...selected, key];
          field.onChange(next);
        };

        return (
          <div>
            <Label className="text-xs text-grey-500 font-normal mb-2">
              {section.title}
              {section.required && <span className="text-danger-500 mr-0.5">*</span>}
            </Label>
            <div className={`space-y-1 rounded-lg p-0.5 ${fieldState.error ? 'ring-1 ring-danger-100' : ''}`}>
              {entries.length === 0 && (
                <p className="text-xs text-grey-300">گزینه‌ای موجود نیست</p>
              )}
              {entries.map(([key, label]) => {
                const checked = selected.includes(key);
                return (
                  <label
                    key={key}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors border ${
                      checked
                        ? 'border-primary-200 bg-primary-50/60'
                        : 'border-transparent hover:bg-grey-50'
                    }`}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggle(key)}
                    />
                    <span className={`text-sm ${checked ? 'text-grey-800 font-medium' : 'text-grey-600'}`}>
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>
            {fieldState.error && (
              <p className="text-[11px] text-danger-500 mt-1">{fieldState.error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}
