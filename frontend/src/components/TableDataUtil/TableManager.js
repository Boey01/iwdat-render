import React, { useState, useContext, useRef } from "react";
import Button from "@mui/material/Button";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import DIModalContent from "./DataImportModal";
import TBModalContent from "./TableBindModal";

export default function TableManager() {
  const {
    globalTables,
    addTablesToGlobalTableList,
    deleteGlobalTable,
    toggleTableVisibility,
    updateTableDataEdit,
    updateTableName,
  } = useContext(GlobalTableContext);

  const [openImportData, setOpenImportData] = useState(false);
  const [openBindTable, setOpenBindTable] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  // const [uploadedFiles, setUploadedFiles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [focusedTable, setFocusedTable] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [focusedName, setFocusedName] = useState("");

  const nameRef = useRef(null);
  let tableIndex;
  const indexFormat = "tb";

  const handleNameDialog = (update) => {
    if (update) {
      const newName = nameRef.current.value;
      updateTableName(focusedTable, newName);
    }
    setIsEditingName(false);
  };

  const handleOpenModal = (type) => {
    //0 = open data import page, 1 = open table binding page
    if(type === 0){
    setOpenImportData(true);
    }
    if(type === 1){
      setOpenBindTable(true);
      }
  };

  const handleCloseModal = (type) => {
     //0 = open data import page, 1 = open table binding page
     if(type === 0){
      setOpenImportData(false);
    setUploadedFile(null);
      }
      if(type === 1){
        setOpenBindTable(false);
        }
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

  const handleEditName = (index,name) =>{
    setIsEditingName(true);
    setFocusedName(name);
    setFocusedTable(index);
  }

  return (
    <>
      <MakeDraggable type="tm">
        <Button variant="contained" onClick={handleOpenPopover} sx={{left: "8vw"}}>
          Table Manager
        </Button>
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
              onClick={()=>(handleOpenModal(0))}
              sx={{ px: 2, width: "100%" }}
            >
              Add new table
            </Button>
          </ListItem>
          <ListItem>
            <Button
              variant="contained"
              onClick={()=>(handleOpenModal(1))}
              sx={{ px: 2, width: "100%" }}
            >
              Bind Table
            </Button>
          </ListItem>
          {globalTables.map((data, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <Checkbox />
                  {data["table_name"]}
                </div>
                <div>
                <IconButton
                     onClick={() => handleEditName(index,data.table_name)}
                    aria-label="name"
                  >
                <EditRoundedIcon/>
                </IconButton>
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
                </div>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>

      {/* --------- end ------- */}

      <Modal open={openImportData} onClose={()=>(handleCloseModal(0))}>
      <>
        <DIModalContent
          upload = {true}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          handleCloseModal={()=>(handleCloseModal(0))}
          addTablesToGlobalTableList={addTablesToGlobalTableList}
        />
        </>
      </Modal>

      <Modal open={openBindTable} onClose={()=>(handleCloseModal(1))}>
        <>
        <TBModalContent
          handleCloseModal={()=>(handleCloseModal(1))}
          globalTables={globalTables}
          addTablesToGlobalTableList={addTablesToGlobalTableList}
        />
        </>
      </Modal>

      <div className="table-workspace">
        {globalTables.map((data, index) => {
          tableIndex = indexFormat + index;
          return (
            <div
              key={tableIndex}
              style={{ display: data.hidden ? "none" : "block" }}
            >
              <MakeDraggable
                type="table"
                index={index}
                position={{x:data["position_x"],y:data["position_y"]}}
              >
                <TableRenderer
                  index={index}
                  sheetData={data["data"]}
                  tableName={data["table_name"]}
                  hidefunction={() => handleHideTable(index)}
                  closefunction={() => handleDeleteTable(index)}
                  updatefunction={updateTableDataEdit}
                  updateName={()=> handleEditName(index, data.table_name)}
                />
              </MakeDraggable>
            </div>
          );
        })}
      </div>
      <Dialog open={isEditingName} onClose={() => handleNameDialog(false)}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="edit-table-nname"
            label="Table Name"
            type="table name"
            fullWidth
            variant="standard"
            inputRef={nameRef}
            defaultValue={focusedName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleNameDialog(false)}>Cancel</Button>
          <Button onClick={() => handleNameDialog(true)}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
