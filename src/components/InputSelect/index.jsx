import React from "react";
import {
  FormControl as FormControlMui,
  InputLabel,
  FormHelperText,
  Select,
} from "@material-ui/core";
import styled from "styled-components";

const FormControl = styled(FormControlMui)`
  min-width: 150px;
  max-width: 350px;
`;

export default function InputSelect({
  errorText,
  register,
  children,
  name,
  label,
  helperText,
  defaultValue,
}) {
  return (
    <FormControl
      {...{ error: Boolean(errorText) }}
      color="secondary"
      size="small"
      variant="outlined"
    >
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Select
        native
        {...{ label, defaultValue }}
        inputProps={{
          ...{ ...register(name), id: name },
        }}
      >
        {children}
      </Select>
      <FormHelperText>{errorText || helperText || ` `}</FormHelperText>
    </FormControl>
  );
}
