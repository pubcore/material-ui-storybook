import React, { useState } from "react";
import AppBar from "./";

export default {
  title: "AppBar",
  argTypes: {
    refresh: { action: "refresh" },
    toggleSidebar: { action: "toggle sidebar" },
  },
};

export const Default = (args) => {
  const [isOpen, open] = useState(false);
  return (
    <AppBar
      {...{
        ...args,
        isOpen,
        toggleSidebar: () => open(!isOpen) || args.toggleSidebar(),
      }}
    />
  );
};
