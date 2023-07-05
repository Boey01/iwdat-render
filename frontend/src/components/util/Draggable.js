import React, { useContext, useState } from 'react';
import Draggable from 'react-draggable';
import { ZIndexContext } from '../contexts/ZIndexContext';
import { GlobalTableContext } from "../contexts/TableContext";

const MakeDraggable = ({ children, type, index, position}) => {
  const { updateTablePosition } = useContext(GlobalTableContext);

  const { globalZIndex, updateGlobalZIndex } = useContext(ZIndexContext);
  const [localZIndex, setLocalZIndex] = useState(globalZIndex);

  const onStart = (event) => {
    const isHandleClicked = event.target.classList.contains('table-title-bar');

    if (!isHandleClicked) {
      if (!event.ctrlKey || event.button !== 0) {
        return false; // Prevent dragging
      }
    }

    updateGlobalZIndex();
    if(type !== "tm")
    setLocalZIndex(globalZIndex + 1);
  };

  const onStop = (event, position) => {
    if (type === 'table') {
      // Call a function to update the position in the global table for table type components
      const newPosition = { x: position.x, y: position.y }
      updateTablePosition(index, newPosition);
    }
  };

  const draggableStyle = {
    zIndex: type === "tm" ? 101:localZIndex,
    position: 'absolute',
  };

  return (
    <Draggable onStart={onStart} onStop={onStop} position={position ? position : undefined}>
      <div style={draggableStyle}>
        {children}
      </div>
    </Draggable>
  );
};

export default MakeDraggable;
