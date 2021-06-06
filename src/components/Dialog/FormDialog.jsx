import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useTranslation } from "react-i18next";

export default function FormDialog({
  cancel,
  execute,
  title,
  name,
  isSubmitting = false,
  children,
}) {
  const { t } = useTranslation();
  return (
    <Dialog
      fullWidth={true}
      onEscapeKeyDown={cancel}
      open={true}
      onClose={cancel}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <form onSubmit={execute}>
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancel}>{t("cancel")}</Button>
          <Button type="submit" color="primary" disabled={isSubmitting}>
            {name}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
