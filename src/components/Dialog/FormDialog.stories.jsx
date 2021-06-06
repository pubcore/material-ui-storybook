import React from "react";
import FormDialog from "./FormDialog";

export default {
  title: "Dialogs",
  args: {
    open: true,
    name: "submit message",
    title: "Messages",
  },
  argTypes: {
    cancel: { action: "cancel" },
    execute: { action: "execute" },
  },
};

export const Form = (args) => (
  <FormDialog {...{ ...args }}>
    <input type="text" />
  </FormDialog>
);
