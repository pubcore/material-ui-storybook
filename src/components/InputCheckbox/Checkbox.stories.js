import React from "react";
import Checkbox from "./";
import { FormDecorator } from "../decorators";

export default {
  title: "Checkboxes",
  decorators: [FormDecorator],
  args: {}, //"form" is injected in FormDecorator
  parameters: {
    defaultValues: { three: true },
  },
};

export const WithoutLabel = (args) => {
    return <Checkbox {...{ ...args, name: "one" }} />;
  },
  WithLabel = (args) => (
    <Checkbox {...{ ...args, name: "two", label: "I read the text" }} />
  ),
  WithDefaultValueTrue = (args) => <Checkbox {...{ ...args, name: "three" }} />;
