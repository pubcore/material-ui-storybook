import React from "react";
import { Box } from "@material-ui/core";

export default function TabPanel({ tab, children }) {
  return (
    <div role="tabpanel" id={`tabpanel-${tab}`} aria-labelledby={`tab-${tab}`}>
      <Box>{children}</Box>
    </div>
  );
}
