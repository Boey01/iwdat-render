import React, { useContext, useState } from 'react';
import Draggable from 'react-draggable';
import { ZIndexContext } from '../contexts/ZIndexContext';
import { GlobalTableContext } from "../contexts/TableContext";
import { GlobalCardContext } from '../contexts/CardContext';

const MakeDraggable = ({ children, type, index, position}) => {
  const { updateTablePosition } = useContext(GlobalTableContext);
  const { updateCardPosition } = useContext(GlobalCardContext);

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
      updateTablePosition(index, position.x, position.y);
    }
    if (type === 'card') {
      updateCardPosition(index, position.x, position.y);
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
