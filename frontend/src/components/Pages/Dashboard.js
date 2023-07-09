import React, { useEffect, useContext, forwardRef } from "react";
import { Button, IconButton } from "@mui/material";
import { GlobalCardContext } from "../contexts/CardContext";
import { ResizableBox } from "react-resizable";
import MakeDraggable from "../util/Draggable";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

const ResizeHandle = forwardRef((props, ref) => {
  const { handleAxis, ...restProps } = props;
  return (
    <i
      className="card-popup-controls card-resize-handle"
      ref={ref}
      {...restProps}
    >
      <OpenInFullRoundedIcon />
    </i>
  );
});

export const Dashboard = () => {
  const { globalCards, deleteCard, updateCardPosition, updateCardSize} = useContext(GlobalCardContext);

  return (
    <div className="dashboard-render">
      <div className="card-render-location make-center">
        {globalCards.map((card, index) => (
          <MakeDraggable 
          type={"card"}
          index={index}
          position={{x:card.position_x,y:card.position_y}}
        >
            <ResizableBox
              key={index}
              className="resizable-card"
              width={card.width}
              height={card.height}
              handle={<ResizeHandle />}
              minConstraints={[150, 150]}
              onResizeStop={(event, { size }) =>
              updateCardSize(index, size.width, size.height)
            }
            >
                <i className="card-popup-controls card-delete-button">
                  <IconButton onClick={()=>deleteCard(index)}><CloseRoundedIcon/></IconButton>
                  </i>

                <div className="card-content">
              <IconButton><AddRoundedIcon fontSize="large"/></IconButton>
              </div>
            </ResizableBox>
          </MakeDraggable>
        ))}
      </div>
    </div>
  );
};
