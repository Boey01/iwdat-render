import React, { useState } from "react";
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
import { Box} from "@mui/material";
import PreviewTable from "./TablePreview";
import TextField from "@mui/material/TextField";

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
  const [uploadedFile, setUploadedFile] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTab, setcurrentTab] = useState(0);
  const [selectedTables, setselectedTables] = useState({});

  const handleChange = (event, newValue) => {
    setcurrentTab(newValue);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setUploadedFile([]);
  };

  const handleFileUploaded = (fileData) => {
    // const newFiles = [...uploadedFiles, fileData];
    setUploadedFile(fileData);
  };

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
    setPopoverOpen(true);
  };

  const handleClosePopover = () => {
    setPopoverOpen(false);
  };

  const handleDeleteTable = (index) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  function TabPanel(props) {
    const { children, value, index, tablename } = props;
    return (
      <div role="tabpanel" hidden={value !== index}>
        {value === index && (
          <Box sx={{ p: 2 }}>
            <TextField id="table_name" label="Table Name" variant="standard" defaultValue={tablename}
            />
            {children}
          </Box>
        )}
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
            <Button variant="contained" onClick={handleOpenModal} sx={{ px: 2 }} >
              Add new table
            </Button>
          </ListItem>
          {uploadedFiles.map((fileData, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton>
                <Checkbox />
                TableName
                <IconButton onClick={() => handleDeleteTable(index)}  edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <ModalContent className="table-preview-modal-content">
          <Button onClick={handleCloseModal} style={{ position: "absolute", top: "8px", right: "8px" }}>
            X
          </Button>
          <Grid container spacing={1}>
            <Grid item xs={12} className="file-upload-section">
              <FileImport onFileUploaded={handleFileUploaded} />
            </Grid>
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
                  <TabPanel value={currentTab} index={index} tablename={key}>
                    <PreviewTable data={uploadedFile[key]} />
                  </TabPanel>
                ))}
              </Grid>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* <div className="table-workspace">
      {uploadedFiles.map((fileData, index) => (
        <div key={index}>
          <MakeDraggable>
            <TableRenderer sheetData={fileData} />
          </MakeDraggable>
        </div>
      ))}
      </div> */}
    </>
  );
}
