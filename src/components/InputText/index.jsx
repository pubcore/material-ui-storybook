import React from "react";
import { TextField as MuiTextField } from "@material-ui/core";
import styled from "styled-components";

const TextField = styled(MuiTextField)`
  ${({ theme: { spacing } }) => `
margin-bottom: ${spacing(1)}px;
.MuiOutlinedInput-input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 100px rgb(0, 0, 0, 0) inset;
  transition: background-color 5000s ease-in-out 0s;
}
`}
`;

export default function InputText({
  register = (name) => ({ name }),
  name,
  label,
  helperText,
  errorText,
  defaultValue,
  multiline,
  rowsMax,
  rows,
  fullWidth,
}) {
  return (
    <TextField
      color="secondary"
      size="small"
      {...{
        error: Boolean(errorText),
        label,
        inputProps: register(name),
        helperText: errorText || helperText || " ",
        defaultValue,
        multiline,
        rowsMax,
        rows,
        fullWidth,
      }}
    />
  );
}
