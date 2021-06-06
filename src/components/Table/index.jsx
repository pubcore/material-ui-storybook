import React, { useMemo } from "react";
import MUIDataTable from "mui-datatables";
import styled from "styled-components";
import { useMediaQuery, Button } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const DataTable = styled(MUIDataTable)`
  ${({ theme: { spacing }, options: { onRowClick } }) => `
  .MuiTableCell-root {
    padding: ${spacing(0.75)}px;
    ${onRowClick && `cursor: pointer;`}
  }
`}
`;

export default function Table({
  title,
  onChange,
  onFilterChange,
  rows,
  count,
  columns,
  page,
  enableNestedDataAccess = "",
  onRowClick,
  filter = false,
  customFooter,
  selectableRows = "none",
  onRowSelectionChange,
  rowsSelected,
  selectableRowsOnClick,
}) {
  const isSmall = useMediaQuery(({ breakpoints }) => breakpoints.down("xs"));
  const { t } = useTranslation();
  const textLabels = useMemo(() => localizeTextLabels(t), [t]);
  return (
    <DataTable
      {...{
        title,
        columns,
        data: rows,
        options: {
          serverSide: true,
          onTableChange: onChange,
          onFilterChange,
          count: count,
          page,
          search: false,
          sort: false,
          print: false,
          filter,
          viewColumns: false,
          jumpToPage: !isSmall,
          enableNestedDataAccess,
          rowsPerPageOptions: isSmall ? [] : [10, 15, 100],
          download: false,
          onRowClick,
          confirmFilters: true,
          customFilterDialogFooter(currentFilterList, applyNewFilters) {
            return (
              <div style={{ marginTop: "40px" }}>
                <Button color="primary" onClick={applyNewFilters}>
                  {t("apply")}
                </Button>
              </div>
            );
          },
          customFooter,
          selectToolbarPlacement: "none",
          selectableRows,
          onRowSelectionChange,
          rowsSelected,
          selectableRowsOnClick,
          textLabels,
        },
      }}
    />
  );
}

const localizeTextLabels = (t) => ({
  body: {
    noMatch: t("table_no_match", "Sorry, no matching records found"),
    toolTip: t("table_tooltip", "Sort"),
    columnHeaderTooltip: (column) =>
      t("table_column_tooltip", `Sort for {{label}}`, { label: column.label }),
  },
  pagination: {
    next: t("table_next", "Next Page"),
    previous: t("table_previous", "Previous Page"),
    rowsPerPage: t("table_rowsPerPage", "Rows per page:"),
    displayRows: t("table_displayRows", "of"),
    jumpToPage: t("table_jumpToPage", "Jump to Page"),
  },
  toolbar: {
    search: t("table_search", "Search"),
    downloadCsv: t("table_downloadCsv", "Download CSV"),
    print: t("table_print", "Print"),
    viewColumns: t("table_viewColumns", "View Columns"),
    filterTable: t("table_filterTable", "Filter Table"),
  },
  filter: {
    all: t("table_filter_all", "All"),
    title: t("table_filter_title", "FILTERS"),
    reset: t("table_filter_reset", "RESET"),
  },
  viewColumns: {
    title: t("table_viewColumns", "Show Columns"),
    titleAria: t("table_titleAria", "Show/Hide Table Columns"),
  },
  selectedRows: {
    text: t("table_selectedRows", "row(s) selected"),
    delete: t("table_selectedRows_delete", "Delete"),
    deleteAria: t("table_selectedRows_deleteAria", "Delete Selected Rows"),
  },
});
