import React, { useContext, useState } from 'react';
import Draggable from 'react-draggable';
import { ZIndexContext } from './ZIndexContext';

const MakeDraggable = ({ children }) => {
  const { globalZIndex, updateGlobalZIndex } = useContext(ZIndexContext);
  const [localZIndex, setLocalZIndex] = useState(globalZIndex);

  const onStart = (event) => {
      if (!event.ctrlKey || event.button !== 0) {
        return false; // Prevent dragging
      }

    updateGlobalZIndex();
    setLocalZIndex(globalZIndex + 1);
  };

  const draggableStyle = {
    zIndex: localZIndex,
    position: 'absolute',
  };

  return (
    <Draggable onStart={onStart} >
      <div style={draggableStyle}>
        {children}
        </div>
    </Draggable>
  );
};

export default MakeDraggable;