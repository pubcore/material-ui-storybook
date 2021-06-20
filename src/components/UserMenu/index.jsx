import React, { Children, useState, isValidElement, cloneElement } from "react";
import {
  Tooltip,
  IconButton,
  Menu,
  Button as MuiButton,
  Avatar as MuiAvatar,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Logout from "../Logout";
import { useSelector } from "../../store";

const label = "user_menu";

const Button = styled(MuiButton)`
  text-transform: none;
`;
const Avatar = styled(MuiAvatar)`
  ${({ theme }) => `
  width: ${theme.spacing(4)};
  height: ${theme.spacing(4)};
  `}
`;

export default function UserMenu({ user = {}, logout, children }) {
  const { t } = useTranslation();
  const { avatar, fullName, username } = useSelector(user);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const isOpen = Boolean(anchorEl);

  return (
    <div>
      {username ? (
        <Button
          id={"ukgdhz"}
          aria-label={t(label)}
          color="inherit"
          startIcon={
            avatar ? <Avatar src={avatar} alt={fullName} /> : <AccountCircle />
          }
          onClick={handleMenu}
          variant="text"
        >
          {username}
        </Button>
      ) : (
        <Tooltip title={t(label)}>
          <IconButton
            aria-label={t(label)}
            aria-owns={isOpen ? "menu-appbar" : null}
            aria-haspopup={true}
            color="inherit"
            onClick={handleMenu}
          >
            <AccountCircle />
          </IconButton>
        </Tooltip>
      )}
      <Menu
        id="menu-appbar"
        disableScrollLock
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        // Make sure the menu is display under the button and not over the appbar
        // See https://material-ui.com/components/menus/#customized-menus
        getContentAnchorEl={null}
        open={isOpen}
        onClose={handleClose}
      >
        {Children.map(children, (menuItem) =>
          isValidElement(menuItem)
            ? cloneElement(menuItem, {
                onClick: handleClose,
              })
            : null
        )}
        <Logout {...{ logout }} />
      </Menu>
    </div>
  );
}
