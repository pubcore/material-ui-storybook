import React from "react";
import { Toolbar as MuiToolbar, AppBar } from "@material-ui/core";
import styled from "styled-components";

const Toolbar = styled(MuiToolbar)`
  justify-content: space-between;
`;

export default function ActionBar({ children }) {
  return (
    <AppBar position="static" color="transparent">
      <Toolbar>{children}</Toolbar>
    </AppBar>
  );
}
