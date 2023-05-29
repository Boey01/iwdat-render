  import React, { useState } from "react";
  import TableContainer from "@mui/material/TableContainer";
  import Table from "@mui/material/Table";
  import TableHead from "@mui/material/TableHead";
  import TableBody from "@mui/material/TableBody";
  import TableRow from "@mui/material/TableRow";
  import TableCell from "@mui/material/TableCell";
  import Paper from "@mui/material/Paper";
  import { styled, useTheme } from "@mui/material/styles";
  import TablePagination from "@mui/material/TablePagination";
  import IconButton from "@mui/material/IconButton";
  import FirstPageIcon from "@mui/icons-material/FirstPage";
  import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
  import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
  import LastPageIcon from "@mui/icons-material/LastPage";
  import PropTypes from "prop-types";
  import Box from "@mui/material/Box";
  import Popover from "@mui/material/Popover";
  import FormGroup from "@mui/material/FormGroup";
  import FormControlLabel from "@mui/material/FormControlLabel";
  import Checkbox from "@mui/material/Checkbox";
  import Button from "@mui/material/Button";
  import EditableTableCell from "./EditableTableCell"

  const CustomTableContainer = styled(TableContainer)({
    maxHeight: "60vh",
    overflowY: "auto",
    width: "70vw",
  });

  export default function TableRenderer({ sheetData }) {
    //process sheet data ---------------
    let sheetName = [];
    Object.keys(sheetData).forEach((key) => {
      sheetName.push(key);
    });

    const firstRow = sheetData[sheetName[0]][0];

    const columns = [];
    Object.keys(firstRow).forEach((key) => {
      columns.push({
        field: key,
        headerName: key,
      });
    });
    //------------------- ---------------

    const [rows, setRows] = useState(sheetData[sheetName[0]]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedColumns, setSelectedColumns] = useState(
      columns.map((column) => column.field)
    );

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handleCellValueChange = (newValue, rowIndex, field) => {
      setRows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[rowIndex][field] = newValue;
        return updatedRows;
      });
    };

    const handlePopoverOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    function renderColumnsManager() {
      return (
        <>
          <Button
            variant="contained"
            onClick={handlePopoverOpen}
            disableElevation
          >
            Select Columns
          </Button>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <FormGroup>
              {columns.map((column) => (
                <FormControlLabel
                  key={column.field}
                  control={
                    <Checkbox
                      checked={selectedColumns.includes(column.field)}
                      onChange={(event) => {
                        const checked = event.target.checked;
                        setSelectedColumns((prevSelectedColumns) => {
                          if (checked) {
                            return [...prevSelectedColumns, column.field];
                          } else {
                            return prevSelectedColumns.filter(
                              (field) => field !== column.field
                            );
                          }
                        });
                      }}
                    />
                  }
                  label={column.headerName}
                />
              ))}
            </FormGroup>
          </Popover>
        </>
      );
    }

    return (
      <>
        <div className="table-wrapper">
          <div className="table-title-bar">
            <span>Table name </span> {renderColumnsManager()}
          </div>
          <CustomTableContainer
            component={Paper}
            elevation={0}
            variant="outlined"
            square
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns
                    .filter((column) => selectedColumns.includes(column.field))
                    .map((column) => (
                      <TableCell key={column.field}>
                        {column.headerName}
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? rows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : rows
                ).map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns
                      .filter((column) => selectedColumns.includes(column.field))
                      .map((column) => (
                        <EditableTableCell
                          key={column.field}
                          value={row[column.field]}
                          rowIndex={rowIndex}
                          field={column.field}
                          onCellValueChange={handleCellValueChange}
                        />
                      ))}
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow>
                    <TableCell colSpan={selectedColumns.length} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CustomTableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        </div>
      </>
    );
  }

  function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }

  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };
