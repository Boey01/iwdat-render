import React, { useState } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import { styled} from "@mui/material/styles";
import TablePagination from "@mui/material/TablePagination";
import Popover from "@mui/material/Popover";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import EditableTableCell from "./EditableTableCell"
import TablePaginationActions from "./TablePaginationActions"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";


const CustomTableContainer = styled(TableContainer)({
  maxHeight: "60vh",
  overflowY: "auto",
  width: "70vw",
});

export default function TableRenderer({ sheetData }) {
   // process sheet data ---------------
   let sheetName = [];
   Object.keys(sheetData).forEach((key) => sheetName.push(key));
 
   const firstRow = sheetData[sheetName[0]][0];
 
   const initialColumns = [];
   Object.keys(firstRow).forEach((key) => {
     initialColumns.push({
       field: key,
       headerName: key,
     });
   });
   //------------------- ---------------
 
   const [columns, setColumns] = useState(initialColumns);
   const [rows, setRows] = useState(sheetData[sheetName[0]]);
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(5);
   const [anchorEl, setAnchorEl] = useState(null);
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
      return updatedRows;
    });
  };

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget);

  const handlePopoverClose = () => setAnchorEl(null);

  const handleColumnReorder = (result) => {
    if (!result.destination) return;

    const reorderedColumns = Array.from(columns);
    const [removed] = reorderedColumns.splice(result.source.index, 1);
    reorderedColumns.splice(result.destination.index, 0, removed);

    setColumns(reorderedColumns);
  };

  const open = Boolean(anchorEl);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

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
           <DragDropContext onDragEnd={handleColumnReorder}>
           <Droppable droppableId="columns" direction="vertical">
        {(provided) => (
          <FormGroup  {...provided.droppableProps} ref={provided.innerRef}>
            {columns.map((column, index) => (
              <Draggable
              key={column.field}
              draggableId={column.field}
              index={index}
            >
              {(provided) => (
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
                {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
              />
              )}
              </Draggable>
            ))}
            {provided.placeholder}
          </FormGroup>
           )}
          </Droppable>
          </DragDropContext>
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
                        page = {page}
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

