'use client';

import { useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

function maskToPattern(mask) {
  if (!mask) return null;
  const maskStr = String(mask);
  const pattern = maskStr
    .split('')
    .map((ch) => (ch === '9' ? '\\d' : ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    .join('');
  return new RegExp(`^${pattern}$`);
}

function applyMask(value, mask) {
  if (!mask) return value;
  const maskStr = String(mask);
  const digits = value.replace(/\D/g, '');
  let result = '';
  let digitIdx = 0;

  for (let i = 0; i < maskStr.length && digitIdx < digits.length; i++) {
    if (maskStr[i] === '9') {
      result += digits[digitIdx++];
    } else {
      result += maskStr[i];
    }
  }

  return result;
}

export default function MaskedField({ name, control, section }) {
  const mask = section.option ? String(section.option) : null;
  const maxLen = mask ? mask.length : undefined;
  const regex = maskToPattern(mask);

  const handleChange = useCallback(
    (e, fieldOnChange) => {
      const raw = e.target.value;
      if (mask) {
        fieldOnChange(applyMask(raw, mask));
      } else {
        fieldOnChange(raw);
      }
    },
    [mask]
  );

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={
        regex
          ? { pattern: { value: regex, message: `فرمت ${section.title} صحیح نیست` } }
          : undefined
      }
      render={({ field, fieldState }) => (
        <div>
          <Label htmlFor={name} className="text-xs text-grey-500 font-normal">
            {section.title}
            {section.required && <span className="text-danger-500 mr-0.5">*</span>}
          </Label>
          {section.placeholder && (
            <p className="text-[11px] text-grey-300 mt-0.5">{section.placeholder}</p>
          )}
          <Input
            id={name}
            value={field.value}
            onChange={(e) => handleChange(e, field.onChange)}
            onBlur={field.onBlur}
            placeholder={mask || section.placeholder || section.title}
            inputMode="numeric"
            maxLength={maxLen}
            dir="ltr"
            aria-invalid={!!fieldState.error}
            className="mt-1 tracking-widest"
          />
          {fieldState.error && (
            <p className="text-[11px] text-danger-500 mt-1">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
