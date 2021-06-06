import styled from "styled-components";
import MuiDrawer from "@material-ui/core/Drawer";
import { NavLink as RrNavLink } from "react-router-dom";
import MuiListItemIcon from "@material-ui/core/ListItemIcon";
const DRAWER_WIDTH = 240;
const CLOSED_DRAWER_WIDTH = 55;

const mapWidth = (sidebar, open) =>
  open
    ? sidebar?.width ?? DRAWER_WIDTH
    : sidebar?.closedWidth ?? CLOSED_DRAWER_WIDTH;

export const Drawer = styled(MuiDrawer)`
  ${({ theme: { sidebar, transitions, breakpoints, palette }, open }) => `
  .MuiDrawer-paper{
    position: relative;
    height: 100%;
    overflow-x: hidden;
    width: ${mapWidth(sidebar, open)}px;
    transition: ${transitions.create("width", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.leavingScreen,
    })};
    background-color: transparent;
    border-right: none;
    ${breakpoints.only("xs")}: {
      margin-top: 0;
      height: 100vh;
      position: inherit;
      background-color: ${palette.background.default};
    }
    ${breakpoints.up("md")}: {
      border: none;
    }
    z-index: inherit;
  }
`}
`;

export const Menu = styled.div`
  ${({ theme: { breakpoints, sidebar }, open }) => `
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 0.5em;
  ${breakpoints.only("xs")}: {
    margin-top: 0;
  }
  ${breakpoints.up("md")}: {
    margin-top: 1.5em;
  }
  width: ${mapWidth(sidebar, open)}px;
  `}
`;

const activeClassName = "nav-item-active";
export const NavLink = styled(RrNavLink).attrs({ activeClassName })`
  ${({ theme: { palette } }) => `
  color: ${palette.text.secondary};
  &.${activeClassName}{
    color:${palette.text.primary};
  }
  `}
`;

export const ListItemIcon = styled(MuiListItemIcon)`
  ${({ theme: { spacing } }) => `
  min-width: ${spacing(5)}px;
  `}
`;
