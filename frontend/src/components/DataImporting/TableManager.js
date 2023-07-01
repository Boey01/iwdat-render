import React, { useState, useContext } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import MakeDraggable from "../util/Draggable";
import Modal from "@mui/material/Modal";
import TableRenderer from "../Table/TableRenderer";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { GlobalTableContext } from "../contexts/TableContext";
import DIModalContent from "./DataImportModal";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const TableManagerButton = styled(Button)({
  left: "10vw",
});

export default function TableManager() {
  
  const { globalTables, 
    addTablesToGlobalTableList, 
    deleteGlobalTable, 
    toggleTableVisibility } = useContext(GlobalTableContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  // const [uploadedFiles, setUploadedFiles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  let tableIndex;
  const indexFormat = "tb"

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setUploadedFile(null);
  };

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
    setPopoverOpen(true);
  };

  const handleClosePopover = () => {
    setPopoverOpen(false);
  };

    const handleDeleteTable = (index) => {
      deleteGlobalTable(index);
    };

    const handleHideTable = (index) => {
      toggleTableVisibility(index);
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
        <List>
          <ListItem>
            <Button
              variant="contained"
              onClick={handleOpenModal}
              sx={{ px: 2 }}
            >
              Add new table
            </Button>
          </ListItem>
          {globalTables.map((data, index) => (
  <ListItem key={index} disablePadding>
    <ListItemButton sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Checkbox />
        {data["name"]}
      </div>
      <IconButton
        onClick={() => handleHideTable(index)}
        aria-label="hide"
      >
        {data.hidden ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </IconButton>
      <IconButton
        onClick={() => handleDeleteTable(index)}
        aria-label="delete"
      >
        <DeleteIcon />
      </IconButton>
    </ListItemButton>
  </ListItem>
))}
        </List>
      </Popover>

      <Modal open={modalOpen} onClose={handleCloseModal}>
            <DIModalContent
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            handleCloseModal={handleCloseModal}
            addTablesToGlobalTableList={addTablesToGlobalTableList}
            />
      </Modal>

      <div className="table-workspace">
      {globalTables.map((data, index) => {
        tableIndex = indexFormat + index;
        return(
        <div id={tableIndex} style={{ display: data.hidden ? 'none' : 'block' }}>
          <MakeDraggable>
            <TableRenderer sheetData={data["data"]} tableName={data["name"]}/>  
          </MakeDraggable>
        </div>
        );
      })}
      </div>
    </>
  );
}
