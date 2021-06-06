import React, { useCallback } from "react";
import { MenuItem, Tooltip, useMediaQuery } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { Drawer, Menu, NavLink, ListItemIcon } from "./styled";
import { useSelector } from "../../store";

export default function Sidebar({ resources, isOpen, toggle, close }) {
  const open = useSelector(isOpen);
  const _resources = useSelector(resources);

  const isXSmall = useMediaQuery(({ breakpoints }) => breakpoints.down("xs"));
  const isSmall = useMediaQuery(({ breakpoints }) => breakpoints.down("sm"));
  const variant = isXSmall ? "temporary" : "permanent";
  const { t } = useTranslation();
  const onItemClick = useCallback(() => {
    if (isSmall || isXSmall) {
      close();
    }
  }, [isXSmall, isSmall, close]);

  return (
    <Drawer {...{ variant, open, onClose: toggle }}>
      <Menu {...{ open }}>
        {_resources.map(({ name, Icon, to }) => {
          //conditional wrap
          var menuItem = (
            <MenuItem tabIndex={0}>
              {Icon && (
                <ListItemIcon>
                  <Icon titleAccess={t(name)} />
                </ListItemIcon>
              )}
              {t(name)}
            </MenuItem>
          );
          return (
            <NavLink key={name} onClick={onItemClick} {...{ to }}>
              {open ? (
                menuItem
              ) : (
                <Tooltip title={t(name)} placement="right">
                  {menuItem}
                </Tooltip>
              )}
            </NavLink>
          );
        })}
      </Menu>
    </Drawer>
  );
}
