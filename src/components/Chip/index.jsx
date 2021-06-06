import React from "react";
import { Chip as MuiChip } from "@material-ui/core";
import styled from "styled-components";

const Chip = styled(MuiChip)`
  ${({ theme: { palette }, severity }) => `
  background-color: ${palette[severity].main};
`}
`;

export function Warning(props) {
  return <Chip size="small" severity="warning" {...props} />;
}

export function Error(props) {
  return <Chip size="small" severity="error" {...props} />;
}

export function Ok(props) {
  return <Chip size="small" severity="success" {...props} />;
}

export function Info(props) {
  return <Chip size="small" severity="info" {...props} />;
}
