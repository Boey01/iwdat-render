import React, { useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import MakeDraggable from "../Draggable";
import Modal from "@mui/material/Modal";
import FileImport from "./FileUploadHandler";
import Grid from "@mui/material/Grid";
import TableRenderer from "./TableRenderer";
import Popover from "@mui/material/Popover";

const TableManagerButton = styled(Button)({
  left: "10vw",
});

const ModalContent = styled("div")({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "16px",
});

export default function TableManager() {
  const [modalOpen, setModalOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleFileUploaded = (fileData) => {
    setUploadedFiles(uploadedFiles => [...uploadedFiles, fileData]);
    handleCloseModal();
  };

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
    setPopoverOpen(true);
  };

  const handleClosePopover = () => {
    setPopoverOpen(false);
  };

  return (
    <>
      <MakeDraggable>
        <TableManagerButton variant="contained" onClick={handleOpenPopover}>
          Table Manager
        </TableManagerButton>
      </MakeDraggable>

      <Popover
        anchorEl={anchorEl}
        open={popoverOpen}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {/* --------- The content of table manager ------- */}
        <Button variant="contained" onClick={handleOpenModal}>
          Add new table
        </Button>
      </Popover>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <ModalContent>
          <Button
            onClick={handleCloseModal}
            style={{ position: "absolute", top: "8px", right: "8px" }}
          >
            X
          </Button>
          <Grid container spacing={1}>
            <Grid item xs={12} className="file-upload-section">
              <FileImport onFileUploaded={handleFileUploaded} />
            </Grid>
          </Grid>
        </ModalContent>
      </Modal>

      {uploadedFiles.map((fileData, index) => (
        <div key={index} className="table-workspace">
          <MakeDraggable>
            <TableRenderer sheetData={fileData} />
          </MakeDraggable>
        </div>
      ))}
    </>
  );
}
