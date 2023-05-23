import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { TableRenderer } from "./TableRenderer";

const DraggableTable = ({ sheetData }) => {
  const handleDragEnd = (result) => {
    // Logic for handling drag and drop events
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="table">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <TableRenderer sheetData={sheetData} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableTable;