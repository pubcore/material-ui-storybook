import React from "react";
import Sidebar from "./";
import { resources } from "./resources";

export default {
  title: "Sidebar",
  argTypes: {
    toggle: { action: "toggle sidebar" },
    close: { action: "close sidebar" },
  },
  args: { resources },
};

export const Default = (args) => <Sidebar {...{ ...args, isOpen: true }} />,
  Closed = (args) => <Sidebar {...{ ...args, isOpen: false }} />;
