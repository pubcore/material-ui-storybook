import React, { forwardRef } from "react";
import {
  ListItemIcon as MuiListItemIcon,
  MenuItem as MuiMenuItem,
  useMediaQuery,
} from "@material-ui/core";
import ExitIcon from "@material-ui/icons/PowerSettingsNew";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const MenuItem = styled(MuiMenuItem)`
  ${({ theme: { palette } }) => `
  color: ${palette.text.secondary};
  `}
`;
const ListItemIcon = styled(MuiListItemIcon)`
  ${({ theme }) => `
  min-width: ${theme.spacing(5)}px;
  `}
`;

const LogoutWithRef = forwardRef(function Logout({ logout }, ref) {
  const { t } = useTranslation();
  const isXSmall = useMediaQuery(({ breakpoints }) => breakpoints.down("xs"));

  return (
    <MenuItem
      {...{ onClick: logout }}
      ref={ref}
      component={isXSmall ? "span" : "li"}
    >
      <ListItemIcon>
        <ExitIcon />
      </ListItemIcon>
      {t("logout")}
    </MenuItem>
  );
});

export default LogoutWithRef;
