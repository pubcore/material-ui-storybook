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
import { CircularProgress, Paper } from "@material-ui/core";
import { ActionBar } from "../";
import ColumnSelector from "./ColumnsSelector";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash-es";

const noRowsRendererDefault = () => (
  <EmptyTable>
    <h1>{"∅"}</h1>
  </EmptyTable>
);
const emptyArray = [];

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
  rowSortServer,
  rowFilter,
  rowFilterServer = emptyArray,
  rowFilterMatch,
  ...rest
}) {
  if (!pageSize) {
    pageSize = Math.round(window.innerHeight / rowHeight) - 7;
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
    return acc.set(name, rest);
  }, new Map());

  useEffect(() => {
    //initial load first rows ...
    var mounted = true;
    if (!loadRows) {
      console.warn("'loadRows' not defined, default to empty array");
      setRowdata((s) => ({
        ...s,
        serverMode: false,
        rows: [],
      }));
      return;
    }
    async function load() {
      var firstPage = await loadRows({
        startIndex: 0,
        stopIndex: pageSize - 1,
      });
      if (firstPage.count <= loadAllUpTo && firstPage.count > pageSize) {
        var all = await loadRows({
          startIndex: 0,
          stopIndex: firstPage.count - 1,
        });
      }
      var { rows, count } = all || firstPage;
      if (mounted) {
        setRowdata((s) => ({
          ...s,
          serverMode: !all,
          rows: [...rows, ...new Array(count - rows.length).fill(null)],
        }));
      }
    }
    load();
    return () => (mounted = false);
  }, [loadRows, pageSize, loadAllUpTo]);

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

  const sort = useCallback(
    ({ sortBy, sortDirection }) => {
      if (serverMode ? rowSortServer.indexOf(sortBy) < 0 : !rowSort[sortBy]) {
        return;
      }
      const compare = (key) => (a, b) => rowSort[key](a?.[key], b?.[key]);
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
    [rowSort, serverMode, rowSortServer, request]
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

  const headerRowRenderer = useCallback(
    (props) => {
      const { className, style } = props;
      return (
        visibleColumns.length > 0 && (
          <>
            <div className={className} role="row" style={style}>
              {props.columns}
            </div>
            {(!serverMode || rowFilterServer.length > 0) &&
              Object.keys(rowFilter).length > 0 && (
                <div className={className} role="row" style={style}>
                  {visibleColumns.map(
                    ({ flexGrow = 0, width, flexShrink = 1, name }) => (
                      <div
                        key={name}
                        className="ReactVirtualized__Table__headerColumn"
                        style={{
                          flex: `${flexGrow} ${flexShrink} ${width}px`,
                        }}
                      >
                        {rowFilter[name] &&
                          (!serverMode || rowFilterServer.indexOf(name) >= 0) &&
                          rowFilter[name]({
                            onChange: handleChangeFilter,
                            name,
                          })}
                      </div>
                    )
                  )}
                </div>
              )}
          </>
        )
      );
    },
    [handleChangeFilter, rowFilter, serverMode, rowFilterServer, visibleColumns]
  );

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

  const height = rowHeight * pageSize + headerHeight;
  const pageCount = Math.ceil(count / pageSize);
  const _onRowsRendered = useRef();

  return rows === null ? (
    <ActionBar>
      &nbsp;
      <CircularProgress />
      &nbsp;
    </ActionBar>
  ) : (
    <Container>
      <ActionBar>
        <h3>{title}</h3>&nbsp;
        {count > 0 && (
          <ColumnSelector
            {...{
              rows,
              selected: selectedColumns,
              setSelected: setSelectedColumns,
              sequence: columnsSequence,
              setSequence: setColumnsSequence,
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
                    {visibleColumns.map(({ name, dataKey, label, ...rest }) => (
                      <Column
                        key={name}
                        {...{
                          dataKey: dataKey ?? name,
                          label: label ?? t(name),
                          ...rest,
                        }}
                      />
                    ))}
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

const Container = styled(Paper)`
  ${({ theme: { palette } }) => `
  .ReactVirtualized__Table__row {
    border-bottom: 1px solid ${palette.divider};
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
