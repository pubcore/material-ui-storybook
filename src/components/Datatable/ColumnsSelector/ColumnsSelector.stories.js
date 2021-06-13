import React from "react";
import ColumnsSelector from "./";

export default {
  title: "columns selector",
  argTypes: {
    setSelected: { action: { name: "setSelected" } },
    setSequence: { action: { name: "setSequence" } },
  },
  args: {
    selected: ["one", "two"],
    sequence: ["one", "two"],
  },
};

const rows = [
  {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    this_is_a_longer_key: 8,
    "dot.seperated.key": 9,
  },
];

export const Default = (args) => <ColumnsSelector {...{ ...args, rows }} />,
  WithFilter = (args) => (
    <ColumnsSelector
      {...{ ...args, rows: [{ ...rows[0], ten: 10, eleven: 11 }] }}
    />
  );
