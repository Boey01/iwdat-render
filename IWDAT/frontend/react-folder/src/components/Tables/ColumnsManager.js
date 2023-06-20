import React from "react";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

export default function ColumnsManager({ 
  columns, 
  selectedColumns, 
  handleColumnReorder,
   setSelectedColumns }) 
   {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget);

  const handlePopoverClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);

  return (
    <>
      <Button variant="contained" onClick={handlePopoverOpen} disableElevation>
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
              <FormGroup {...provided.droppableProps} ref={provided.innerRef}>
                {columns.map((column, index) => (
                  <Draggable key={column.field} draggableId={column.field} index={index}>
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
