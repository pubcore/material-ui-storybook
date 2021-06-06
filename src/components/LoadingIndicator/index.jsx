import React from "react";
import { CircularProgress as MuiCircularProgress } from "@material-ui/core";
import styled from "styled-components";
import { useTheme } from "@material-ui/core/styles";
import { useSelector } from "../../store";
import { Tooltip, IconButton } from "@material-ui/core";
import { Refresh } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
const label = "refresh";

const CircularProgress = styled(MuiCircularProgress)`
  ${({ theme: { spacing } }) => `
  margin: ${spacing(2)}px;
  `}
`;

export default function LoadingIndicator({ isLoading, refresh }) {
  const theme = useTheme();
  const showSpinner = useSelector(isLoading);
  const { t } = useTranslation();
  return showSpinner ? (
    <CircularProgress size={theme.spacing(2)} color="inherit" thickness={6} />
  ) : (
    <Tooltip title={t(label)}>
      <IconButton aria-label={t(label)} color="inherit" onClick={refresh}>
        <Refresh />
      </IconButton>
    </Tooltip>
  );
}
