import React from "react";
import { Warning, Error, Ok } from "./index";

export default {
  title: "Chips",
};

export const Warn = () => <Warning label="warn" />,
  Err = () => <Error label="Error" />,
  OK = () => <Ok label="Ok" />;
