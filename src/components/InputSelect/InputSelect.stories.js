import React from "react";
import InputSelect from "./";

export default {
  title: "InputSelect",
  args: {
    register: () => {},
    label: "select stars",
  },
};

export const Default = (args) => <InputSelect {...{ ...args }} />;
export const Error = (args) => (
  <InputSelect
    {...{
      ...args,
      errorText:
        "exploded with a longer text, and there should occure a line break",
    }}
  />
);
