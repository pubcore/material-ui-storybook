import React, { useCallback, useState } from "react";
import { Popover, Button, Tooltip } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

export default function ActionSelector({ label, children }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const onClose = useCallback(() => setAnchorEl(null), [setAnchorEl]);
  const showPopover = useCallback(({ currentTarget }) => {
    setAnchorEl(currentTarget);
  }, []);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();
  return (
    <div>
      <Tooltip title={t("select_actions")}>
        <Button color="primary" size="small" id="iojjty" onClick={showPopover}>
          {label || t("actions")}
        </Button>
      </Tooltip>
      <Popover
        onClick={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        {...{ open, onClose, anchorEl }}
      >
        <Container>{children}</Container>
      </Popover>
    </div>
  );
}

const Container = styled.div`
  ${({ theme: { spacing } }) => `
  margin: ${spacing(2)}px;
  display:flex;
  flex-direction:column;
  > button, > div{
    margin:${spacing(0.5)}px;
  }
`}
`;
