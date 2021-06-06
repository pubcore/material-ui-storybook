import React, { useState } from "react";
import Layout from "./";
import Login from "./LoginPage";
import { resources } from "../Sidebar/resources";

export default {
  title: "Layout",
};

export const LoginPage = () => <Login />,
  LoginPageWithBg = () => <Login {...{ withBg: true }} />,
  Default = () => {
    const [sidebarIsOpen, toggle] = useState(true);
    return (
      <Layout
        {...{
          resources,
          sidebarIsOpen,
          toggleSidebar: () => toggle(!sidebarIsOpen),
          closeSidebar: () => toggle(false),
          refresh: () => {},
        }}
      />
    );
  };
