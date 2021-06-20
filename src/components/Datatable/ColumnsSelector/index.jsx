import React, { useCallback, useState } from "react";
import {
  Popover,
  IconButton,
  Tooltip,
  Switch,
  FormGroup,
  FormControlLabel,
  TextField,
  ButtonGroup,
} from "@material-ui/core";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

export default function ColumnSelector({
  columns = [],
  setSequence,
  selected = [],
  setSelected,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const onClose = useCallback(() => setAnchorEl(null), [setAnchorEl]);
  const showPopover = useCallback(({ currentTarget }) => {
    setAnchorEl(currentTarget);
  }, []);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();
  const switchColumn = useCallback(
    ({ currentTarget: { name } }, checked) =>
      setSelected(
        checked
          ? selected.includes(name)
            ? selected
            : selected.concat(name)
          : selected.filter((col) => col != name)
      ),
    [setSelected, selected]
  );
  const [filter, setFilter] = useState("");
  const onFilterChange = useCallback(
    ({ currentTarget: { value } }) => setFilter(value),
    []
  );
  const stepRight = useCallback(
    ({ currentTarget: { name } }) => {
      var current = columns.indexOf(name);
      if (current >= columns.length - 1) {
        return columns;
      }
      var a = columns.slice();
      [a[current], a[current + 1]] = [a[current + 1], a[current]];
      setSequence(a);
    },
    [columns, setSequence]
  );
  const stepLeft = useCallback(
    ({ currentTarget: { name } }) => {
      var current = columns.indexOf(name);
      if (current <= 0) {
        return columns;
      }
      var a = columns.slice();
      [a[current], a[current - 1]] = [a[current - 1], a[current]];
      setSequence(a);
    },
    [columns, setSequence]
  );
  return (
    <div>
      <Tooltip title={t("manage_columns")}>
        <IconButton id="kzzdjq" onClick={showPopover}>
          <ViewColumnIcon />
        </IconButton>
      </Tooltip>
      <Popover
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        {...{ open, onClose, anchorEl }}
      >
        <Container>
          <h4>{t("manage_columns")}</h4>
          {columns.length > 10 && (
            <TextField
              {...{
                id: "lslzqj",
                size: "small",
                onChange: onFilterChange,
                placeholder: t("input_placeholder_filter", "filter ..."),
              }}
            />
          )}
          <FormGroup>
            {columns
              .filter(
                (col) => !(filter && filter !== 0) || col.includes(filter)
              )
              .sort()
              .map((column) => (
                <FormGroup
                  row
                  key={column}
                  style={{ justifyContent: "space-between" }}
                >
                  <FormControlLabel
                    key={column}
                    control={
                      <Switch
                        {...{
                          name: column,
                          onChange: switchColumn,
                          checked: selected.includes(column),
                        }}
                      />
                    }
                    label={t(column.replaceAll(".", "_"))}
                    id={
                      "columns_selector_switch_" + column.replaceAll(".", "_")
                    }
                  />
                  <ButtonGroup size="small">
                    <Tooltip title={t("move_column_one_step_left")}>
                      <IconButton id="ozkis" name={column} onClick={stepLeft}>
                        <ArrowLeftIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("move_column_one_step_right")}>
                      <IconButton id="ptejd" name={column} onClick={stepRight}>
                        <ArrowRightIcon />
                      </IconButton>
                    </Tooltip>
                  </ButtonGroup>
                </FormGroup>
              ))}
          </FormGroup>
        </Container>
      </Popover>
    </div>
  );
}

const Container = styled.div`
  ${({ theme: { spacing } }) => `
  margin: ${spacing(2)}px;
`}
`;
