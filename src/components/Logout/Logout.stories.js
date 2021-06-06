import React from "react";
import Logout from "./";

export default {
  title: "Logout",
  argTypes: {
    logout: { action: "logout" },
  },
};

export const Default = (args) => <Logout {...{ ...args }} />;
