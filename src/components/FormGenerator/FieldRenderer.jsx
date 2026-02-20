'use client';

import TextField from './fields/TextField';
import TextareaField from './fields/TextareaField';
import NumberField from './fields/NumberField';
import SingleSelectField from './fields/SingleSelectField';
import MultiSelectField from './fields/MultiSelectField';
import DateField from './fields/DateField';
import UploaderField from './fields/UploaderField';
import TimeField from './fields/TimeField';
import CascadeSelectField from './fields/CascadeSelectField';

const FIELD_MAP = {
  0: TextField,
  1: TextareaField,
  3: NumberField,
  4: SingleSelectField,
  5: MultiSelectField,
  6: DateField,
  7: UploaderField,
  8: UploaderField,
  9: UploaderField,
  14: TimeField,
  10: CascadeSelectField,
};

export default function FieldRenderer({ section, control }) {
  const name = `section_${section.sectionId}`;
  const Component = FIELD_MAP[section.type];

  if (!Component) return null;

  return (
    <div data-field={name}>
      <Component name={name} control={control} section={section} />
    </div>
  );
}
