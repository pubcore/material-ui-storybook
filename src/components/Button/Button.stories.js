import React from "react";
import { Button } from "@material-ui/core";

export default {
  title: "Buttons",
  argTypes: { refresh: { action: "refresh" } },
};

export const Default = () => <Button>Default</Button>,
  Primary = () => <Button color="primary">Primary</Button>,
  Secondary = () => <Button color="secondary">Secondary</Button>;
