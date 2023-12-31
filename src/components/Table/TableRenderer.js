import React, { useState } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import TablePagination from "@mui/material/TablePagination";
import EditableTableCell from "./EditableTableCell";
import TablePaginationActions from "./TablePaginationActions";
import ColumnsManager from "./ColumnsManager";
import CloseIcon from "@mui/icons-material/Close";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { IconButton, Stack } from "@mui/material";

const CustomTableContainer = styled(TableContainer)({
  maxHeight: "60vh",
  overflowY: "auto",
  width: "70vw",
});

export default function TableRenderer({
  index,
  sheetData,
  tableName,
  hidefunction,
  closefunction,
  updatefunction,
  updateName,
}) {
  // process sheet data ---------------
  const firstRow = sheetData[0];
  const initialColumns = [];
  Object.keys(firstRow).forEach((key) => {
    initialColumns.push({
      field: key,
      headerName: key,
    });
  });
  //------------------- ---------------

  const [columns, setColumns] = useState(initialColumns);
  const [rows, setRows] = useState(sheetData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedColumns, setSelectedColumns] = useState(
    initialColumns.map((column) => column.field)
  );

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCellValueChange = (newValue, rowIndex, field) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[rowIndex][field] = newValue;
      
      updatefunction(index, updatedRows);
      return updatedRows;
    });

  };

  const handleColumnReorder = (result) => {
    if (!result.destination) return;

    const reorderedColumns = Array.from(columns);
    const [removed] = reorderedColumns.splice(result.source.index, 1);
    reorderedColumns.splice(result.destination.index, 0, removed);

    setColumns(reorderedColumns);
  };

  const handleDeleteColumn = (field) => {
    setColumns((prevColumns) =>
      prevColumns.filter((column) => column.field !== field)
    );
    setSelectedColumns((prevSelectedColumns) =>
      prevSelectedColumns.filter((selectedColumn) => selectedColumn !== field)
    );

    const updatedData = sheetData.map((row) => {
      const updatedRow = { ...row };
      delete updatedRow[field];
      return updatedRow;
    });
  
    updatefunction(index, updatedData);
  };
  
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <>
      <div className="table-wrapper">
        <div className="table-title-bar spread-items">
          <span className="table-title" onDoubleClick={updateName}>{tableName}</span>
          <Stack direction="row" spacing={3} sx={{pr:2}}>
            <ColumnsManager
              columns={columns}
              selectedColumns={selectedColumns}
              handleColumnReorder={handleColumnReorder}
              setSelectedColumns={setSelectedColumns}
              handleDeleteColumn ={handleDeleteColumn}
            />
            <IconButton onClick={hidefunction} aria-label="hide" sx={{color:"white"}}>
              <RemoveRoundedIcon/>
            </IconButton>
            <IconButton onClick={closefunction} aria-label="delete" sx={{color:"white"}}>
              <CloseIcon />
            </IconButton>
            </Stack>
        </div>
        <CustomTableContainer
          component={Paper}
          elevation={0}
          variant="outlined"
          square
        >
          <Table stickyHeader>
            <TableHead >
              <TableRow>
                {columns
                  .filter((column) => selectedColumns.includes(column.field))
                  .map((column) => (
                    <TableCell key={column.field} sx={{ fontWeight: 'bold' }}>
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
                        page={page}
                        rowsPerPage={rowsPerPage}
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
