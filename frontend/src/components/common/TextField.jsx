import React from 'react';
import { TextField as MuiTextField } from '@mui/material';

const TextField = React.forwardRef(({ 
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = true,
  multiline = false,
  rows = 1,
  placeholder,
  inputProps,
  ...props 
}, ref) => {
  return (
    <MuiTextField
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error || helperText}
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      multiline={multiline}
      rows={rows}
      placeholder={placeholder}
      inputProps={inputProps}
      variant="outlined"
      inputRef={ref}
      {...props}
    />
  );
});

TextField.displayName = 'TextField';

export default TextField;
