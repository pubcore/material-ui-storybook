import React from "react";
import styled from "styled-components";
import { Paper } from "@material-ui/core";

const StyledForm = styled("form")`
  ${({ theme: { spacing }, width }) => `
  > *{
    margin: ${spacing(0.3)}px;
  }
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  ${width && `width: ${width}px;`}
  padding:${spacing(2)}px;
  `}
`;

export default function Form({ onSubmit, children, width }) {
  return (
    <Paper elevation={2}>
      <StyledForm {...{ onSubmit, width }}>{children}</StyledForm>
    </Paper>
  );
}
