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
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import DIModalContent from "./DataImportModal";
import TBModalContent from "./TableBindModal";

const TableManagerButton = styled(Button)({
  left: "10vw",
});

export default function TableManager() {
  const {
    globalTables,
    addTablesToGlobalTableList,
    deleteGlobalTable,
    toggleTableVisibility,
    updateTableDataEdit,
  } = useContext(GlobalTableContext);

  const [openImportData, setOpenImportData] = useState(false);
  const [openBindTable, setOpenBindTable] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  // const [uploadedFiles, setUploadedFiles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  let tableIndex;
  const indexFormat = "tb";

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
      if(type === 0){
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

  return (
    <>
      <MakeDraggable type="tm">
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
                  {data["name"]}
                </div>
                <div>
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
        <DIModalContent
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          handleCloseModal={()=>(handleCloseModal(0))}
          addTablesToGlobalTableList={addTablesToGlobalTableList}
        />
      </Modal>

      <Modal open={openBindTable} onClose={()=>(handleCloseModal(1))}>
        <TBModalContent
          handleCloseModal={()=>(handleCloseModal(1))}
          addTablesToGlobalTableList={addTablesToGlobalTableList}
        />
      </Modal>

      <div className="table-workspace">
        {globalTables.map((data, index) => {
          tableIndex = indexFormat + index;
          return (
            <div
              id={tableIndex}
              style={{ display: data.hidden ? "none" : "block" }}
            >
              <MakeDraggable
                type="table"
                index={index}
                position={data["position"]}
              >
                <TableRenderer
                  index={index}
                  sheetData={data["data"]}
                  tableName={data["name"]}
                  hidefunction={() => handleHideTable(index)}
                  closefunction={() => handleDeleteTable(index)}
                  updatefunction={updateTableDataEdit}
                />
              </MakeDraggable>
            </div>
          );
        })}
      </div>
    </>
  );
}
