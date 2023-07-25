import React, { useContext, useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { ZIndexContext } from '../contexts/ZIndexContext';
import { GlobalTableContext } from "../contexts/TableContext";
import { GlobalCardContext } from '../contexts/CardContext';

const MakeDraggable = ({ children, type, index, position }) => {
  const { updateTablePosition } = useContext(GlobalTableContext);
  const { updateCardPosition } = useContext(GlobalCardContext);

  const { globalZIndex, updateGlobalZIndex } = useContext(ZIndexContext);
  const [localZIndex, setLocalZIndex] = useState(globalZIndex);
  const [isCtrlKeyPressed, setIsCtrlKeyPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Control') {
        setIsCtrlKeyPressed(true);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === 'Control') {
        setIsCtrlKeyPressed(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const onStart = (event) => {
    const isHandleClicked = event.target.classList.contains('table-title-bar');

    if (!isHandleClicked) {
      if (!event.ctrlKey || event.button !== 0) {
        return false; // Prevent dragging
      }
    }

    updateGlobalZIndex();
    if (type !== "tm")
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
    zIndex: type === "tm" ? 101 : (isCtrlKeyPressed ? localZIndex : globalZIndex),
    position: 'absolute',
    boxShadow: isCtrlKeyPressed ? '0 0 10px #DFF250' : 'none', 
    left: type === "tm" ? "10vw" : undefined,
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
