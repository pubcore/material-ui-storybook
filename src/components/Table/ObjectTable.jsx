import React from "react";
import SimpleTable from "./SimpleTable";
import { get } from "lodash-es";
import i18n from "i18next";

const Cell = ({ row, column }) => {
  switch (column) {
    case "key":
      return i18n.t(row.name + "_" + row[column].replace(".", "_")) + ":";
    default:
      return typeof row[column] === "object"
        ? Object.values(row[column]).map((val, index) => (
            <div key={index}>{val}</div>
          ))
        : row[column] ?? "";
  }
};
const columns = ["key", "value"];

export default function ObjectTable({
  o,
  attributes = [],
  name = "",
  ...rest
}) {
  const rows = attributes.reduce(
    (acc, attr) => acc.concat([{ key: attr, value: get(o, attr, ""), name }]),
    []
  );
  return <SimpleTable {...{ rows, columns, Cell, ...rest }} />;
}
