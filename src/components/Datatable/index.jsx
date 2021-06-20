import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { InfiniteLoader, Table, AutoSizer, Column } from "react-virtualized";
import "react-virtualized/styles.css";
import Pagination from "@material-ui/lab/Pagination";
import { CircularProgress, Paper, Checkbox, Tooltip } from "@material-ui/core";
import { ActionBar } from "../";
import ColumnSelector from "./ColumnsSelector";
import ColumnHead from "./ColumnHead";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash-es";
import initThroat from "throat";
const throat = initThroat(10);

const noRowsRendererDefault = () => (
  <EmptyTable>
    <h1>{"∅"}</h1>
  </EmptyTable>
);
const emptyArray = [];
const cellValDefault = (row, key) => row[key];

export default function Datatable({
  title,
  //https://github.com/bvaughn/react-virtualized/blob/master/docs/Column.md
  columns = emptyArray,
  loadRows,
  pageSize,
  headerHeight = 40,
  rowHeight = 30,
  noRowsRenderer = noRowsRendererDefault,
  loadAllUpTo = 100,
  rowSort,
  rowSortServer = emptyArray,
  rowFilter,
  rowFilterServer = emptyArray,
  rowFilterMatch,
  onRowClick,
  maxResourceLimit = 100,
  manageColumns = true,
  cellVal = cellValDefault,
  selectedRows,
  toggleRowSelection,
  toggleAllRowsSelection,
  selectRowCellRenderer = selectRowCellRendererDefault,
  selectRowHeaderRenderer = selectRowHeaderRendererDefault,
  ...rest
}) {
  if (!pageSize) {
    pageSize = Math.max(Math.round(window.innerHeight / rowHeight) - 11, 10);
  }
  const { t } = useTranslation();
  const [rowdata, setRowdata] = useState({
    rows: null,
    filteredRows: null,
    sorting: {},
    filter: {},
    serverMode: true,
  });
  const { rows, filteredRows, filter, sorting, serverMode } = rowdata;
  const count = (filteredRows || rows)?.length ?? 0;
  const [pagination, setPagination] = useState({ page: 1 });
  const columnsMap = columns.reduce((acc, { name, ...rest }) => {
    return acc.set(name, {
      ...rest,
      disableSort: serverMode
        ? !rowSortServer.includes(name)
        : !rowSort?.[name],
    });
  }, new Map());

  useEffect(() => {
    //initial load first rows ...
    var mounted = true;
    if (!loadRows) {
      console.warn("'loadRows' not defined, default to empty array");
      setRowdata((s) => ({
        ...s,
        serverMode: false,
        rows: emptyArray,
      }));
      return;
    }
    async function load() {
      var firstPage = await loadRows({
        startIndex: 0,
        stopIndex: pageSize - 1,
      });
      var all;
      if (firstPage.count <= loadAllUpTo && firstPage.count > pageSize) {
        var batchCount = Math.ceil(firstPage.count / maxResourceLimit);
        all = {
          rows: (
            await Promise.all(
              new Array(batchCount).fill(null).map((_, index) =>
                throat(() =>
                  loadRows({
                    startIndex: index * maxResourceLimit,
                    stopIndex: (index + 1) * maxResourceLimit - 1,
                  })
                )
              )
            )
          ).reduce((acc, { rows }) => acc.concat(rows), []),
          count: firstPage.count,
        };
      } else if (firstPage.count <= pageSize) {
        all = firstPage;
      }

      var { rows, count } = all || firstPage;
      if (mounted) {
        setRowdata((s) => ({
          ...s,
          serverMode: !all,
          rows: [...rows, ...new Array(count - rows.length).fill(null)],
        }));
        setColumnsSequence((sequence) => [
          ...new Set([...sequence, ...Object.keys(rows[0])]),
        ]);
      }
    }
    load();
    return () => (mounted = false);
  }, [loadRows, pageSize, loadAllUpTo, maxResourceLimit]);

  const isRowLoaded = useCallback(
    ({ index }) => Boolean((filteredRows || rows)[index]),
    [rows, filteredRows]
  );
  const loadMoreRows = useCallback(
    async ({ startIndex, stopIndex }) => {
      var { rows: newRows } = await loadRows({
        startIndex,
        stopIndex,
        filter,
        sorting,
      });
      setRowdata(({ rows, ...rest }) => ({
        ...rest,
        rows: [
          ...rows.slice(0, startIndex),
          ...newRows,
          ...rows.slice(startIndex + newRows.length),
        ],
      }));
    },
    [loadRows, filter, sorting]
  );

  const rowGetter = useCallback(
    ({ index }) => (filteredRows || rows)?.[index] || {},
    [rows, filteredRows]
  );

  const handleRowsScroll = useCallback(
    (props) => {
      setPagination((s) => ({
        ...s,
        page: Math.ceil(props.stopIndex / pageSize),
        scrollToIndex: undefined,
      }));
      _onRowsRendered.current(props);
    },
    [pageSize]
  );

  const handlePageChange = useCallback(
    (event, page) => {
      const scrollToIndex = (page - 1) * pageSize;
      return setPagination((s) => ({ ...s, page, scrollToIndex }));
    },
    [pageSize]
  );

  //request sorted and filtered data from server (serverMode == true)
  const request = useMemo(
    () =>
      debounce(async ({ filter, sorting }) => {
        var { rows, count } = await loadRows({
          startIndex: 0,
          stopIndex: pageSize - 1,
          filter,
          sorting,
        });
        setRowdata((s) => ({
          ...s,
          rows: [...rows, ...new Array(count - rows.length).fill(null)],
        }));
        setPagination((s) => ({ ...s, page: 1, scrollToIndex: 0 }));
      }, 300),
    [loadRows, pageSize]
  );

  const sort = useCallback(
    ({ sortBy, sortDirection }) => {
      if (serverMode ? !rowSortServer.includes(sortBy) : !rowSort[sortBy]) {
        return;
      }

      const compare = (key) => (a, b) =>
        rowSort[key](cellVal(a, key), cellVal(b, key));

      setRowdata(({ rows, filteredRows, filter, serverMode, ...rest }) => {
        if (serverMode) {
          request({ filter, sorting: { sortBy, sortDirection } });
        }
        return {
          ...rest,
          rows,
          filter,
          serverMode,
          filteredRows: serverMode
            ? null
            : ((r) => (sortDirection === "DESC" ? r.reverse() : r))(
                (filteredRows || rows).slice().sort(compare(sortBy))
              ),
          sorting: { sortBy, sortDirection },
        };
      });
    },
    [rowSort, serverMode, rowSortServer, request, cellVal]
  );

  const [selectedColumns, setSelectedColumns] = useState(
    columns.map(({ name }) => name)
  );
  const [columnsSequence, setColumnsSequence] = useState(selectedColumns);

  const visibleColumns = useMemo(() => {
    return columnsSequence.reduce(
      (acc, name) =>
        selectedColumns.includes(name)
          ? acc.concat({
              name,
              ...(columnsMap.get(name) || { width: 100 }),
            })
          : acc,
      []
    );
  }, [columnsMap, selectedColumns, columnsSequence]);

  const handleChangeFilter = useCallback(
    async ({ target: { name, value } }) => {
      setRowdata(({ filter = {}, rows, serverMode, sorting, ...rest }) => {
        var newFilter = {
          ...filter,
          [name]: value === "" ? undefined : value,
        };
        if (serverMode) {
          request({ filter: newFilter, sorting });
        }
        return {
          ...rest,
          rows,
          sorting,
          serverMode,
          filter: newFilter,
          filteredRows: serverMode
            ? null
            : rows.filter((row) => rowFilterMatch({ row, filter: newFilter })),
        };
      });
    },
    [rowFilterMatch, request]
  );

  const headerRowRenderer = useCallback(
    (props) => {
      const { className, style } = props;
      return (
        visibleColumns.length > 0 && (
          <>
            <div className={className} role="row" style={style}>
              {props.columns}
            </div>
            {(!serverMode || rowFilterServer.length > 0) && rowFilter && (
              <div className={className} role="row" style={style}>
                {(selectedRows
                  ? [
                      <div
                        key="_rowSelection"
                        className="ReactVirtualized__Table__headerColumn"
                        dataKey="_rowSelection"
                        style={{
                          flex: `0 1 40px`,
                        }}
                      />,
                    ]
                  : []
                ).concat(
                  visibleColumns.map(
                    ({ flexGrow = 0, width, flexShrink = 1, name }) => (
                      <div
                        key={name}
                        className="ReactVirtualized__Table__headerColumn"
                        style={{
                          flex: `${flexGrow} ${flexShrink} ${width}px`,
                        }}
                      >
                        {rowFilter[name] &&
                          (!serverMode || rowFilterServer.includes(name)) &&
                          rowFilter[name]({
                            onChange: handleChangeFilter,
                            name,
                          })}
                      </div>
                    )
                  )
                )}
              </div>
            )}
          </>
        )
      );
    },
    [
      handleChangeFilter,
      rowFilter,
      serverMode,
      rowFilterServer,
      visibleColumns,
      selectedRows,
    ]
  );

  const height = rowHeight * pageSize + headerHeight;
  const pageCount = Math.ceil(count / pageSize);
  const _onRowsRendered = useRef();

  return rows === null ? (
    <ActionBar>
      &nbsp;
      <CircularProgress color="secondary" />
      &nbsp;
    </ActionBar>
  ) : (
    <Container {...{ has_row_action: onRowClick ? "1" : "" }}>
      <ActionBar>
        <h3>{title}</h3>&nbsp;
        {manageColumns && count > 0 && (
          <ColumnSelector
            {...{
              columns: columnsSequence,
              setSequence: setColumnsSequence,
              selected: selectedColumns,
              setSelected: setSelectedColumns,
            }}
          />
        )}
      </ActionBar>
      <div>
        <InfiniteLoader
          minimumBatchSize={50}
          threshold={50}
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={count}
        >
          {({ onRowsRendered, registerChild }) => {
            _onRowsRendered.current = onRowsRendered;
            return (
              <AutoSizer disableHeight>
                {({ width }) => (
                  <Table
                    {...{
                      headerHeight,
                      height,
                      rowGetter,
                      rowHeight,
                      width,
                      noRowsRenderer,
                      headerRowRenderer,
                      onRowClick,
                      onRowsRendered: handleRowsScroll,
                      ref: registerChild,
                      rowCount: count,
                      scrollToIndex: pagination.scrollToIndex,
                      scrollToAlignment: "start",
                      sort: sort,
                      sortBy: sorting.sortBy,
                      sortDirection: sorting.sortDirection,
                      ...rest,
                    }}
                  >
                    {(selectedRows
                      ? [
                          <Column
                            columnData={{
                              selectedRows,
                              toggleRowSelection,
                              toggleAllRowsSelection,
                              rowCount: count,
                              title: t("toggle_all_rows_selection"),
                            }}
                            key="_rowSelection"
                            cellRenderer={selectRowCellRenderer}
                            dataKey="_rowSelection"
                            width={40}
                            headerRenderer={selectRowHeaderRenderer}
                            disableSort={true}
                          />,
                        ]
                      : []
                    ).concat(
                      visibleColumns.map(
                        ({ name, dataKey, label, ...rest }) => (
                          <Column
                            key={name}
                            {...{
                              dataKey: dataKey ?? name,
                              label: label ?? t(name),
                              headerRenderer: ColumnHead,
                              ...rest,
                            }}
                          />
                        )
                      )
                    )}
                  </Table>
                )}
              </AutoSizer>
            );
          }}
        </InfiniteLoader>
      </div>
      <Footer>
        {t("total_count_of_rows", "Total count of rows: {{count}}", { count })}
        <Pagination
          count={pageCount}
          page={pagination.page}
          onChange={handlePageChange}
        />
      </Footer>
    </Container>
  );
}

const selectRowCellRendererDefault = ({
  columnData: { selectedRows, toggleRowSelection },
  rowIndex,
}) => (
  <Checkbox
    {...{
      id: "olmekd#" + rowIndex,
      name: String(rowIndex),
      checked: selectedRows.has(rowIndex),
      onChange: toggleRowSelection,
    }}
  />
);

const selectRowHeaderRendererDefault = ({
  columnData: { selectedRows, toggleAllRowsSelection, rowCount, title },
}) => {
  return (
    toggleAllRowsSelection && (
      <Tooltip title={title}>
        <Checkbox
          {...{
            id: "etdaaq",
            indeterminate:
              selectedRows.size > 0 && selectedRows.size != rowCount,
            checked: rowCount === selectedRows.size,
            onChange: toggleAllRowsSelection,
          }}
        />
      </Tooltip>
    )
  );
};

const Container = styled(Paper)`
  ${({ theme: { palette }, has_row_action }) => `
  .ReactVirtualized__Table__row {
    border-bottom: 1px solid ${palette.divider};
    ${has_row_action && `cursor: pointer;`}
  }
  .ReactVirtualized__Table__row:hover {
    background-color: ${palette.action.hover};
  }
  .ReactVirtualized__Table__headerRow{
    text-transform: none;
  }
  .ReactVirtualized__Table__sortableHeaderIcon{
    width:none;
    height:none;
  }
`}
`;

const Footer = styled.div`
  ${({ theme: { spacing } }) => `
  padding: ${spacing(1)}px;
`}
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const EmptyTable = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
