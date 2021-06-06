import styled from "styled-components";
import MuiMenuIcon from "@material-ui/icons/Menu";
import {
  IconButton as MuiIconButton,
  Toolbar as MuiToolbar,
  Typography,
} from "@material-ui/core";

export const Toolbar = styled(MuiToolbar)`
  padding-right: 24px;
`;

export const IconButton = styled(MuiIconButton)`
  margin-left: 0.2em;
  margin-right: 0.2em;
`;

export const MenuIcon = styled(MuiMenuIcon)`
  ${({ theme: { transitions }, open }) => `
  transition: ${transitions.create(["transform"], {
    easing: transitions.easing.sharp,
    duration: transitions.duration.leavingScreen,
  })};
  transform: rotate(${open ? 180 : 0}deg);
  `}
`;

export const Title = styled(Typography)`
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
