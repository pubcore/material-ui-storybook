import React from "react";
import Form from "./";

export default {
  title: "Form container",
  argTypes: {
    onSubmit: { action: "onSubmit" },
  },
};

export const Default = (args) => <Form {...args} />;
