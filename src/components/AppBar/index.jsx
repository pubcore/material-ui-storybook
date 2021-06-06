import React, { Children } from "react";
import { AppBar as MuiAppBar, Tooltip, useMediaQuery } from "@material-ui/core";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";
import { useTranslation } from "react-i18next";
import LoadingIndicator from "../LoadingIndicator";
import UserMenu from "../UserMenu";
import { Toolbar, IconButton, MenuIcon, Title } from "./styled";
import { useSelector } from "../../store";

export default function AppBar({
  isOpen,
  toggleSidebar,
  isLoading,
  refresh,
  user,
  logout,
  children,
}) {
  const open = useSelector(isOpen);
  const scrollTrigger = useScrollTrigger();
  const isXSmall = useMediaQuery(({ breakpoints }) => breakpoints.down("xs"));
  const { t } = useTranslation();

  return (
    <Slide appear={false} direction="down" in={!scrollTrigger}>
      <MuiAppBar color="secondary">
        <Toolbar disableGutters variant={isXSmall ? "regular" : "dense"}>
          <Tooltip
            title={t(open ? "close_menu" : "open_menu", "Open/Close menu")}
            enterDelay={1000}
          >
            <IconButton color="inherit" onClick={toggleSidebar}>
              <MenuIcon {...{ open }} />
            </IconButton>
          </Tooltip>
          {Children.count(children) === 0 ? (
            <Title variant="h6" color="inherit" id="react-admin-title" />
          ) : (
            children
          )}
          <LoadingIndicator {...{ refresh, isLoading }} />
          <UserMenu {...{ user, logout }} />
        </Toolbar>
      </MuiAppBar>
    </Slide>
  );
}
