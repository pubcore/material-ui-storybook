import React from "react";
import Form from "./";
import { Button } from "@material-ui/core";

export default {
  title: "Form container",
  argTypes: {
    onSubmit: { action: "onSubmit" },
  },
};

export const Default = (args) => (
  <Form {...args}>
    <Button>dummy, to make the form not empty</Button>
  </Form>
);
