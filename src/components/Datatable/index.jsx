import React, { useState, useCallback, useEffect } from "react";
import { InfiniteLoader, Table, AutoSizer, Column } from "react-virtualized";
import "react-virtualized/styles.css";
import MuiPagination from "@material-ui/lab/Pagination";
import { CircularProgress, Paper } from "@material-ui/core";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash-es";

export default function Datatable({
  columns = [],
  loadRows,
  pageSize,
  headerHeight = 40,
  rowHeight = 30,
  noRowsRenderer,
  loadAllUpTo = 100,
  rowSort,
  rowSortServer,
  rowFilter,
  rowFilterServer = [],
  rowFilterMatch = () => true,
}) {
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
  useEffect(() => {
    //initial load first rows ...
    var mounted = true;
    async function load() {
      var firstPage = await loadRows({
        startIndex: 0,
        stopIndex: pageSize - 1,
      });
      if (firstPage.count <= loadAllUpTo) {
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
      console.log({ startIndex, stopIndex });
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
    (onRowsRendered) => (props) => {
      setPagination((s) => ({
        ...s,
        page: Math.ceil(props.stopIndex / pageSize),
        scrollToIndex: undefined,
      }));
      onRowsRendered(props);
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
      if (serverMode) {
        request({ filter, sorting: { sortBy, sortDirection } });
      }
      const compare = (key) => (a, b) => rowSort[key](a?.[key], b?.[key]);
      setRowdata(({ rows, filteredRows, ...rest }) => ({
        ...rest,
        rows,
        filteredRows: serverMode
          ? null
          : ((r) => (sortDirection === "DESC" ? r.reverse() : r))(
              (filteredRows || rows).slice().sort(compare(sortBy))
            ),
        sorting: { sortBy, sortDirection },
      }));
    },
    [rowSort, serverMode, rowSortServer, request, filter]
  );

  const headerRowRenderer = useCallback(
    (props) => {
      const { className, style } = props;
      return (
        <>
          <div className={className} role="row" style={style}>
            {props.columns}
          </div>
          {(!serverMode || rowFilterServer.length > 0) &&
            Object.keys(rowFilter).length > 0 && (
              <div className={className} role="row" style={style}>
                {columns.map(
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
                        rowFilter[name]({ onChange: handleChangeFilter, name })}
                    </div>
                  )
                )}
              </div>
            )}
        </>
      );
    },
    [handleChangeFilter, rowFilter, columns, serverMode, rowFilterServer]
  );

  const request = debounce(
    useCallback(
      async ({ filter, sorting }) => {
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
      },
      [loadRows, pageSize]
    ),
    300
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

  return rows === null ? (
    <CircularProgress />
  ) : (
    <Container>
      <div>
        <InfiniteLoader
          minimumBatchSize={50}
          threshold={50}
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={count}
        >
          {({ onRowsRendered, registerChild }) => (
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
                    onRowsRendered: handleRowsScroll(onRowsRendered),
                    ref: registerChild,
                    rowCount: count,
                    scrollToIndex: pagination.scrollToIndex,
                    scrollToAlignment: "start",
                    sort: sort,
                    sortBy: sorting.sortBy,
                    sortDirection: sorting.sortDirection,
                  }}
                >
                  {columns.map(({ name, width, flexGrow }) => (
                    <Column
                      key={name}
                      {...{
                        dataKey: name,
                        width,
                        label: t(name),
                        flexGrow,
                      }}
                    />
                  ))}
                </Table>
              )}
            </AutoSizer>
          )}
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

const Pagination = styled(MuiPagination)``;
const Footer = styled.div`
  ${({ theme: { spacing } }) => `
  padding: ${spacing(1)}px;
`}
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
