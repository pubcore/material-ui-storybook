import React from "react";
import LoadingIndicator from "./";

export default {
  title: "Loading indicator",
  argTypes: { refresh: { action: "refresh" } },
};

export const Default = (args) => <LoadingIndicator {...{ ...args }} />,
  Loading = (args) => <LoadingIndicator {...{ ...args, isLoading: true }} />;
