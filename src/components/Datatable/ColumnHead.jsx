import React from "react";
import { TableSortLabel } from "@material-ui/core";

export default function ColumnHead({
  dataKey,
  label,
  sortBy,
  sortDirection,
  disableSort,
}) {
  return (
    <span
      className="ReactVirtualized__Table__headerTruncatedText"
      key="label"
      title={typeof label === "string" ? label : null}
    >
      {disableSort ? (
        label
      ) : (
        <TableSortLabel
          active={dataKey === sortBy}
          direction={dataKey === sortBy ? sortDirection.toLowerCase() : "asc"}
        >
          {label}
        </TableSortLabel>
      )}
    </span>
  );
}
