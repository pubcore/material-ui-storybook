import React from "react";
import { A } from "../";
import { Trans } from "react-i18next";
import { useConfig } from "../../store";

export default function Help() {
  const helpUri = useConfig("general_help_uri");
  return (
    <span>
      <Trans i18nKey="general_help">
        Need help? <A href={helpUri}>Click here</A> and let us help you.
      </Trans>
    </span>
  );
}
