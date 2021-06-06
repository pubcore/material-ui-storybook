import React from "react";
import Login from "./";

export default {
  title: "Login",
  parameters: { actions: { argTypesRegex: "^on.*" } },
  argTypes: { login: { action: "login" } },
  args: {
    registerUri: "https://localhost",
  },
};

export const Default = (args) => <Login {...{ ...args }} />,
  Wait = (args) => (
    <Login
      {...{
        ...args,
        login: () => new Promise((res) => setTimeout(() => res({}), 1000)),
      }}
    />
  );
