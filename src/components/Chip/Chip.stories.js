import React from "react";
import { Warning, Error, Ok, Info } from "./index";

export default {
  title: "Chips",
};

export const Warn = () => <Warning label="warn" />,
  Err = () => <Error label="Error" />,
  OK = () => <Ok label="Ok" />,
  Information = () => <Info label="Info" />;
