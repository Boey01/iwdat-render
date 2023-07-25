import React from "react";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Checkbox from "@mui/material/Checkbox";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import IconButton from "@mui/material/IconButton";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { StrictModeDroppable } from "../util/CustomComponents";

export default function ColumnsManager({ 
  columns, 
  selectedColumns, 
  handleColumnReorder,
   setSelectedColumns,
   handleDeleteColumn }){
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget);

  const handlePopoverClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);

  return (
    <>
      <Button variant="contained" onClick={handlePopoverOpen} disableElevation color="five" sx={{borderRadius:2}}>
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
          <StrictModeDroppable droppableId="columns" direction="vertical">
            {(provided) => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {columns.map((column, index) => (
                  <Draggable key={column.field} draggableId={column.field} index={index} isDragDisabled={false}>
                    {(provided) => (
                      <ListItem key={column.field}  
                      ref={provided.innerRef} 
                      {...provided.draggableProps} 
                      {...provided.dragHandleProps}
                      disablePadding
                      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      >
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

                          {column.headerName}

                          <IconButton
                            onClick={()=>{handleDeleteColumn(column.field)}}
                            aria-label="Delete"
                          >
                            <DeleteRoundedIcon/>
                          </IconButton>
                        </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      </Popover>
    </>
  );
}
