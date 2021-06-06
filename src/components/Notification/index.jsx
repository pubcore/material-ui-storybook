import React, { useCallback } from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useTranslation } from "react-i18next";
import { useSelector } from "../../store";

export default function Notification({ message, notified }) {
  const {
    textkey,
    description = textkey,
    args = {},
    severity,
    autoHideDuration = 4000,
  } = useSelector(message) || {};
  const onClose = useCallback(() => notified(), [notified]);
  const { t } = useTranslation();
  return (
    <Snackbar
      {...{
        anchorOrigin: { vertical: "top", horizontal: "right" },
        open: Boolean(textkey),
        autoHideDuration,
        onClose,
      }}
    >
      <Alert {...{ onClose, severity }}>{t(textkey, description, args)}</Alert>
    </Snackbar>
  );
}
