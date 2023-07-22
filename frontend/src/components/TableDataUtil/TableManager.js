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
  const [uploadedFile, setUploadedFile] = useState(null);
  const [focusedTable, setFocusedTable] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [focusedName, setFocusedName] = useState("");
  const [selectedTables, setSelectedTables] = useState([]);

  const nameRef = useRef(null);
  let tableIndex;
  const indexFormat = "tb";

  
  useEffect(() => {
    // Add event listener when the component mounts
    window.addEventListener("keydown", handleCloseModal);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleCloseModal);
    };
  }, [openImportData,openBindTable]);

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
    console.log("A")
     if(openImportData){
      setOpenImportData(false);
    setUploadedFile(null);
      }
      if(openBindTable ){
        setOpenBindTable(false);
        }
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
      <AccordionDetails sx={{boxShadow:2, borderBottomLeftRadius:"10px", borderBottomRightRadius:"10px"}}>
        {/* --------- The content of table manager ------- */}
        <List>
          <ListItem style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={()=>(handleOpenModal(0))}
              sx={{ px: 2, width: "100%"}}
            >
              Add new table
            </Button>
          </ListItem>
          <ListItem style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={()=>(handleOpenModal(1))}
              sx={{ px: 2, width: "100%" }}
            >
              Bind Table
            </Button>
          </ListItem>
          <ListItem style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={()=>exportTablesToFile(selectedTables,globalTables)}
              sx={{ px: 2, width: "100%" }}
            >
              Export Tables
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
    </>
  );
}
