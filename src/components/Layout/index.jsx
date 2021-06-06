import React from "react";
import { Layout, AppFrame, Main, Content } from "./styled";
import AppBar from "../AppBar";
import Sidebar from "../Sidebar";
import Notification from "../Notification";
import { Outlet } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

export default function Page({
  resources,
  sidebarIsOpen,
  toggleSidebar,
  closeSidebar,
  refresh,
  isLoading,
  user,
  logout,
  message,
  notified,
}) {
  const { t } = useTranslation();
  return (
    <Layout>
      <AppFrame>
        <AppBar
          {...{
            isOpen: sidebarIsOpen,
            toggleSidebar,
            refresh,
            isLoading,
            user,
            logout,
          }}
        />
        <Main>
          <Sidebar
            {...{
              resources,
              isOpen: sidebarIsOpen,
              toggle: toggleSidebar,
              close: closeSidebar,
            }}
          />
          <Content id="main-content">
            <Outlet />
            <Typography variant="subtitle2" color="textSecondary">
              {t("copyright", "pubcore - ")}
              {new Date().getFullYear()}
            </Typography>
          </Content>
        </Main>
      </AppFrame>
      {<Notification {...{ message, notified }} />}
    </Layout>
  );
}
