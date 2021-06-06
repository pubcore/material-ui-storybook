import React from "react";
import Notification from "./";

export default {
  title: "Notification",
  argTypes: { notified: { action: "notified" } },
};

export const Success = (args) => (
    <Notification
      {...{
        ...args,
        message: { textkey: "sun_shine", severity: "success" },
      }}
    />
  ),
  Warning = (args) => (
    <Notification
      {...{
        ...args,
        message: {
          //to test string interpolation, this key is wrong, but i18n supports it
          textkey: "{{count}}_clouds",
          args: { count: 3 },
          severity: "warning",
        },
      }}
    />
  ),
  Error = (args) => (
    <Notification
      {...{
        ...args,
        message: { severity: "error", textkey: "a_thunderstorm" },
      }}
    />
  ),
  NoTextkeyNoMessage = (args) => <Notification {...{ ...args }} />;
