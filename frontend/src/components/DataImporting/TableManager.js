import React, { useState, useContext } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import MakeDraggable from "../Draggable";
import Modal from "@mui/material/Modal";
import FileImport from "./FileUploadHandler";
import Grid from "@mui/material/Grid";
import TableRenderer from "../Table/TableRenderer";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";
import PreviewTable from "./TablePreview";
import Input from '@mui/material/Input';
import { GlobalTableContext } from "../contexts/TableContext";

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
  const { globalTables, setGlobalTables, addTablesToGlobalTableList } = useContext(GlobalTableContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  // const [uploadedFiles, setUploadedFiles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTab, setcurrentTab] = useState(0);
  const [checkedTables, setCheckedTables] = useState([]);
  const [tableNames, setTableNames] = useState([]);

  const handleChange = (event, newValue) => {
    setcurrentTab(newValue);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setUploadedFile(null);
  };

  const handleFileUploaded = (fileData) => {
    // const newFiles = [...uploadedFiles, fileData];
    setUploadedFile(fileData);
    setCheckedTables([]);
    setTableNames([]);
  };

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
    setPopoverOpen(true);
  };

  const handleClosePopover = () => {
    setPopoverOpen(false);
  };

  const handleDeleteTable = (index) => {
    const updatedFiles = [...globalTables];
    updatedFiles.splice(index, 1);
    setGlobalTables(updatedFiles);
  };

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    const index = id;
    setCheckedTables((prevcheckedTables) => ({
      ...prevcheckedTables,
      [index]: checked,
    }));

  };

  const handleTableNameChange = (index, value) => {
  const updatedTableNames = [...tableNames];
  updatedTableNames[index] = value;
  setTableNames(updatedTableNames);
};

const handleConfirmTables = () => {
  const selectedTables = {};
  for (const key in checkedTables) {
    if (checkedTables[key]) {
      const tableName = tableNames[key] || Object.keys(uploadedFile)[key];
      selectedTables[tableName] = uploadedFile[Object.keys(uploadedFile)[key]];
    }
  }

  if(Object.keys(selectedTables).length !== 0){
    addTablesToGlobalTableList(selectedTables);
}
  // Reset the checked tables and close the popover/modal if needed
  setCheckedTables([]);
  setPopoverOpen(false);
  handleCloseModal();
  setTableNames([]);
  setUploadedFile(null);
};

  function TabPanel(props) {
    const { children, value, index } = props;
    return (
      <div role="tabpanel" hidden={value !== index}>
        {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
      </div>
    );
  }

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
        <ModalContent className="table-preview-modal-content">
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
  {uploadedFile && (
    <>
      <Grid item xs={12}>
        <Tabs
          value={currentTab}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="primary"
    >
          {Object.keys(uploadedFile).map((key, index) => (
            <Tab label={key} index={index} />
          ))}
        </Tabs>
      </Grid>
      <Grid item xs={12}>
        {Object.keys(uploadedFile).map((key, index) => (
          <TabPanel value={currentTab} index={index} key={index}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Checkbox
                  id={index}
                  checked={checkedTables[index] || false}
                  onChange={handleCheckboxChange}
                />
              </Grid>
              <Grid item>
              <Input
              defaultValue={tableNames[index] || key}
              onBlur={(event) => handleTableNameChange(index, event.target.value)}
              inputProps={{ 'aria-label': 'Table name' }}
              />
              </Grid>
            </Grid>
            <PreviewTable data={uploadedFile[key]} />
          </TabPanel>
        ))}
      </Grid>
      <Grid item xs={12}>
        <Button variant="outlined" onClick={handleConfirmTables}>Confirm Tables</Button>
      </Grid>
    </>
  )}
</Grid>

        </ModalContent>
      </Modal>

      <div className="table-workspace">
      {globalTables.map((data, index) => (
        <div key={index}>
          <MakeDraggable>
            <TableRenderer sheetData={data["data"]} tableName={data["name"]}/>  
          </MakeDraggable>
        </div>
      ))}
      </div>
    </>
  );
}
