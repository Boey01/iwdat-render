import React, { useState} from 'react';
import Draggable from 'react-draggable';

const MakeDraggable = ({ children }) => {

  const onStart = (event) => {
    if (!event.ctrlKey || event.button !== 0) {
      return false; // Prevent dragging
    }
  };


  const dragHandlers = { onStart };
  
  const draggableStyle = {
    zIndex: 0,
    position: 'absolute',
  };

  return (
    <Draggable {...dragHandlers}>
        <div style={draggableStyle}>{children}</div>
    </Draggable>
  );
};

export default MakeDraggable;