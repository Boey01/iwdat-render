import React, { useState, useEffect, useContext, useRef } from "react";
import Button from "@mui/material/Button";
import MakeDraggable from "../util/Draggable";
import Modal from "@mui/material/Modal";
import TableRenderer from "../Table/TableRenderer";
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
import  {exportTablesToFile}  from "./ExportTables"
import RightClickIcon from "../../static/right-click.svg";
import AddToPhotosRoundedIcon from '@mui/icons-material/AddToPhotosRounded';  
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded';
import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded';

import DIModalContent from "./DataImportModal";
import TBModalContent from "./TableBindModal";
import { Avatar, Box, Divider, ListItemIcon, MenuItem, MenuList, Popover, Stack, Typography } from "@mui/material";

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
  const [uploadedFile, setUploadedFile] = useState(null);
  const [focusedTable, setFocusedTable] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [focusedName, setFocusedName] = useState("");
  const [selectedTables, setSelectedTables] = useState([]);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);

  const nameRef = useRef(null);
  let tableIndex;
  const indexFormat = "tb";

  useEffect(() => {
    const modalEscClose = (event) => {
      if (event.keyCode === 27) {
        handleCloseModal();
      }
    }
    window.addEventListener("keydown", modalEscClose);

    return () => {
      window.removeEventListener("keydown", modalEscClose);
    };
  }, [openImportData,openBindTable]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.pageX, y: e.pageY });
    setShowContextMenu(true);
  };

  const handleHideContextMenu = () => {
    setShowContextMenu(false);
  };

  const handleContextMenuAction = (action) => {
    switch (action) {
      case "add":
        handleOpenModal(0);
        break;
      case "bind":
        handleOpenModal(1)
        break;        
      case "export":
        exportTablesToFile(selectedTables, globalTables);
        break;
      default:
        break;
    }
    handleHideContextMenu();
  };
  
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

  function handleCloseModal(){
     if(openImportData){
      setOpenImportData(false);
    setUploadedFile(null);
      }
      if(openBindTable ){
        setOpenBindTable(false);
        }
  };

  const handleDeleteTable = (index) => {
    setSelectedTables((prevState) =>
    prevState.filter((item) => item !== index)
  );
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
    <Accordion onContextMenu={handleContextMenu} sx={{position:"static"}}>
      <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ backgroundColor:"#fcfcfc", borderRadius: '10px', boxShadow:"0 4px 5px -5px"}}
        >
          <Box sx={{width:"100%"}} className="spread-items">
          <Typography sx={{fontWeight:500}}>
          Table Manager
          </Typography>
          {selectedTables.length > 0 && <Avatar sx ={{width:20, height:20, opacity:0.9, mb:0.4}} src={RightClickIcon} />}
          </Box>
          </AccordionSummary>
      <AccordionDetails sx={{boxShadow:2, borderBottomLeftRadius:"10px", borderBottomRightRadius:"10px", p:0.2}}>
        {/* --------- The content of table manager ------- */}
        <List>
          <ListItem style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={()=>(handleOpenModal(0))}
              sx={{ px: 2, width: "100%"}}
              color="six"
            >
              Add new table
            </Button>
          </ListItem>
          <ListItem style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={()=>(handleOpenModal(1))}
              sx={{ px: 2, width: "100%" }}
              color="six"
            >
              Bind Table
            </Button>
          </ListItem>
          {globalTables.map((data, index) => (
            <ListItem key={index} disablePadding>
              <Checkbox
            checked={selectedTables.includes(index)}
            onChange={() =>
              setSelectedTables((prevState) =>
                prevState.includes(index)
                  ? prevState.filter((item) => item !== index)
                  : [...prevState, index]
              )
            }
            color="six"
          />
              <ListItemButton
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                              
                <Box sx={{pr:2}}>
                  {data["table_name"]}
                </Box>
                <div>
                  <Stack direction={"row"}>
                  <IconButton
                     onClick={() => handleEditName(index,data.table_name)}
                    aria-label="name"
                  >
                <EditRoundedIcon/>
                </IconButton>
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

      <Modal open={openImportData} onClose={handleCloseModal}>
      <>
        <DIModalContent
          upload = {true}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          handleCloseModal={handleCloseModal}
          addTablesToGlobalTableList={addTablesToGlobalTableList}
        />
        </>
      </Modal>

      <Modal open={openBindTable} onClose={handleCloseModal} className="make-center">
        <>
        <TBModalContent
          handleCloseModal={handleCloseModal}
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

      {showContextMenu && (
        <Popover
        open={showContextMenu}
        onClose={handleHideContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={{
          top: contextMenuPosition.y,
          left: contextMenuPosition.x,
        }}
      >
          <MenuList autoFocus={true}>
            <MenuItem onClick={() => handleContextMenuAction("add")}>
            <ListItemIcon>
            <AddToPhotosRoundedIcon fontSize="small"/>
          </ListItemIcon>
              Add table
              </MenuItem>
            <MenuItem onClick={() => handleContextMenuAction("bind")}>
            <ListItemIcon>
            <CompareArrowsRoundedIcon fontSize="small"/>
          </ListItemIcon>
              Bind table
              </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleContextMenuAction("export")} disabled={selectedTables.length < 1}>
             <ListItemIcon>
            <IosShareRoundedIcon fontSize="small"/>
          </ListItemIcon>
              Export Selected(s)
            </MenuItem>
          </MenuList>
        </Popover>
      )}

    </>
  );
}
