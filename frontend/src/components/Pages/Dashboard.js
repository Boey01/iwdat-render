import React, { useState, useEffect, useContext, forwardRef } from "react";
import { IconButton } from "@mui/material";
import { GlobalCardContext } from "../contexts/CardContext";
import { ResizableBox } from "react-resizable";
import MakeDraggable from "../util/Draggable";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DVModalContent from "../CardUtil/DataVisualizeModal";
import Modal from "@mui/material/Modal";
import RenderChart from "../CardUtil/RenderChart";

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
  const { globalCards, deleteCard, updateCardSize} = useContext(GlobalCardContext);
  const [openModal, setOpenModal] = useState(false);
  const [focusedCard, setFocusedCard] = useState(null);

  const handleOpenModal = (index) => {
    setOpenModal(true);
    setFocusedCard(index)
  }

  const handleCloseModal = () => {
    setOpenModal(false);
  }

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
              {!card.visualized ? 
              <IconButton onClick={()=>handleOpenModal(index)}>
                <AddRoundedIcon fontSize="large"/>
                </IconButton>
              :
              <RenderChart
              type= {card.chart_type}
              data={card.visual_config.data}
              dataKey={card.visual_config.dataKey}
              horizontal={card.visual_config.horizontal}
              colors={card.visual_config.colors}
            />}
              </div>
            </ResizableBox>
          </MakeDraggable>
        ))}
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        <DVModalContent index={focusedCard} handleCloseModal={handleCloseModal}/>
      </Modal>
    </div>
  );
};
