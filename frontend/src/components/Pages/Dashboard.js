import React, { useState, useRef, useContext, forwardRef } from "react";
import { IconButton, Typography } from "@mui/material";
import { GlobalCardContext } from "../contexts/CardContext";
import { ResizableBox } from "react-resizable";
import MakeDraggable from "../util/Draggable";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DVModalContent from "../CardUtil/DataVisualizeModal";
import Modal from "@mui/material/Modal";
import RenderChart from "../CardUtil/RenderChart";
import TitleIcon from "@mui/icons-material/Title";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

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
  const { globalCards, deleteCard, updateCardSize, updateCardTitle } =
    useContext(GlobalCardContext);
  const [openModal, setOpenModal] = useState(false);
  const [focusedCard, setFocusedCard] = useState(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [focusedTitle, setFocusedTitle] = useState("");

  const titleRef = useRef(null);

  const handleOpenModal = (index) => {
    setOpenModal(true);
    setFocusedCard(index);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleTitleDialog = (update) => {
    if (update) {
      const newTitle = titleRef.current.value;
      updateCardTitle(focusedCard, newTitle);
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="dashboard-render">
      <div className="card-render-location make-center">
        {globalCards.map((card, index) => (
          <MakeDraggable
            type={"card"}
            index={index}
            position={{ x: card.position_x, y: card.position_y }}
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
                <IconButton onClick={() => deleteCard(index)}>
                  <CloseRoundedIcon />
                </IconButton>
              </i>

             {card.visualized && <i className="card-popup-controls card-edit-title-button">
                <IconButton
                  onClick={() => {
                    setIsEditingTitle(true);
                    setFocusedTitle(card.visual_config.title);
                    setFocusedCard(index);
                  }}
                >
                  <TitleIcon />
                </IconButton>
              </i>}

              <div className="card-content">
                {!card.visualized ? (
                  <IconButton onClick={() => handleOpenModal(index)}>
                    <AddRoundedIcon fontSize="large" />
                  </IconButton>
                ) : (
                  <>
                    <Typography variant="h6">
                      {card.visual_config.title}
                    </Typography>
                    <RenderChart
                      type={card.chart_type}
                      data={card.visual_config.data}
                      dataKey={card.visual_config.dataKey}
                      horizontal={card.visual_config.horizontal}
                      colors={card.visual_config.colors}
                    />
                  </>
                )}
              </div>
            </ResizableBox>
          </MakeDraggable>
        ))}
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        <DVModalContent
          index={focusedCard}
          handleCloseModal={handleCloseModal}
        />
      </Modal>

      <Dialog open={isEditingTitle} onClose={() => handleTitleDialog(false)}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="edit-title"
            label="Title"
            type="title"
            fullWidth
            variant="standard"
            inputRef={titleRef}
            defaultValue={focusedTitle}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleTitleDialog(false)}>Cancel</Button>
          <Button onClick={() => handleTitleDialog(true)}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
