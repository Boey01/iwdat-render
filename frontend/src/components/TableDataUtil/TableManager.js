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
import {Accordion}from '../util/CustomComponents';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import DIModalContent from "./DataImportModal";
import TBModalContent from "./TableBindModal";
import { Box, Divider, Stack, Typography } from "@mui/material";

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
    <Accordion className="table-manager-btn">
      <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ backgroundColor:"#fcfcfc", borderRadius: '10px', boxShadow:"0 4px 5px -5px"}}
        >
          <Typography sx={{fontWeight:"bold"}}>
          Table Manager
          </Typography>
          </AccordionSummary>
      <AccordionDetails>
        {/* --------- The content of table manager ------- */}
        <List>
          <ListItem>
            <Box sx={{display:"flex", alignItems:"center", width:"100%"}}>
            <Button
              variant="contained"
              onClick={()=>(handleOpenModal(0))}
              sx={{ px: 2}}
            >
              Add new table
            </Button>
            </Box>
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
                                <IconButton
                     onClick={() => handleEditName(index,data.table_name)}
                    aria-label="name"
                  >
                <EditRoundedIcon/>
                </IconButton>
                <Box sx={{px:2}}>
                  {data["table_name"]}
                </Box>
                <div>
                  <Stack direction={"row"}>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

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
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

                  </Stack>
                </div>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        </AccordionDetails>
        </Accordion>
      </MakeDraggable>
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
