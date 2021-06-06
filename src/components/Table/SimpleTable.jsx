import React from "react";
import {
  Table as TableMui,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TableHead,
} from "@material-ui/core";
import styled from "styled-components";

const Table = styled(TableMui)`
  width: max-content;
`;

export default function SimpleTable({
  rows,
  columns,
  Cell = () => null,
  HeadCell,
  ...rest
}) {
  return (
    <TableContainer component={Paper}>
      <Table size="small" {...rest}>
        {HeadCell && (
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>
                  <HeadCell {...{ column }} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell align="left" key={column + index}>
                  <Cell {...{ column, row, rows, index }} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
