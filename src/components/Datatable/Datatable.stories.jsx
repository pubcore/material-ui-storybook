import Datatable from "./";
import React from "react";
import { TextField } from "@material-ui/core";
import testRows from "./testRows.json";
import { action } from "@storybook/addon-actions";
const simulateRequestTime = 150; //ms
const loadRows =
  (count) =>
  ({ startIndex, stopIndex, filter, sorting }) => {
    return new Promise((res) =>
      setTimeout(() => {
        var rows = testRows.filter((row) =>
          filter?.name ? row.name.includes(filter.name) : true
        );
        if (sorting?.sortDirection) {
          rows = rows.sort((a, b) => (a.name < b.name ? -1 : 1));
        }
        if (sorting?.sortDirection === "DESC") {
          rows.reverse();
        }
        var n = stopIndex - startIndex + 1;
        //repeat test rows for counts over 10000
        res({
          rows: rows.slice(
            startIndex % 10000,
            (startIndex % 10000) + Math.min(n, count)
          ),
          count: filter?.name ? rows.length : count,
        });
      }, simulateRequestTime)
    );
  };

const textCompare = (a, b) =>
  ("" + a ?? "").localeCompare(b ?? "", undefined, { numeric: true });
const FilterText = ({ name, onChange }) => (
  <TextField
    size="small"
    type="search"
    key={name}
    {...{
      name,
      onChange,
      placeholder: "filter ...",
      autoComplete: "off",
    }}
  />
);
export default {
  title: "Datatable",
  args: {
    title: "List of fake addresses",
    loadRows: loadRows(5000),
    rowSort: {
      id: textCompare,
      name: textCompare,
      zip: textCompare,
      email: textCompare,
      city: textCompare,
    },
    rowSortServer: [],
    columns: [
      { name: "id", width: 40 },
      { name: "name", width: 150 },
      { name: "email", width: 250 },
      { name: "city", width: 150 },
      { name: "date", width: 200, flexGrow: 1 },
    ],
    rowFilter: {
      name(props) {
        return FilterText(props);
      },
      email(props) {
        return FilterText(props);
      },
      zip(props) {
        return FilterText(props);
      },
      city(props) {
        return FilterText(props);
      },
    },
    rowFilterServer: [],
    rowFilterMatch: ({ row, filter }) =>
      Object.entries(filter).every(
        ([key, value]) => (!value && value !== 0) || row[key].includes(value)
      ),
    loadAllUpTo: 5000,
  },
};

export const EmptyTable = () => <Datatable />,
  AllRowsLoaded = (args) => <Datatable {...{ ...args }} />,
  SomeRowsLoadedNoServerSideFilterAvailable = (args) => (
    <Datatable {...{ ...args, loadRows: loadRows(1000000) }} />
  ),
  SomeRowsLoadedWithServerSideFilterAndSort = (args) => (
    <Datatable
      {...{
        ...args,
        loadRows: loadRows(1000000),
        rowFilterServer: ["name"],
        rowSortServer: ["name"],
      }}
    />
  ),
  BoundOnRowClick = (args) => (
    <Datatable
      {...{
        ...args,
        loadRows: loadRows(10),
        onRowClick: action("onRowClick"),
      }}
    />
  ),
  RowSelectionImutable = (args) => (
    <Datatable {...{ ...args, selectedRows: new Set([0, 1]) }} />
  ),
  RowSelection = (args) => (
    <Datatable
      {...{
        ...args,
        selectedRows: new Set([0, 1]),
        toggleRowSelection: action("toggleRowSelection"),
      }}
    />
  ),
  RowSelectionWithToggleAllRowsHeader = (args) => (
    <Datatable
      {...{
        ...args,
        loadRows: loadRows(2),
        selectedRows: new Set([0]),
        toggleRowSelection: action("toggleRowSelection"),
        toggleAllRowsSelection: action("toggleAllRowsSelection"),
      }}
    />
  );
