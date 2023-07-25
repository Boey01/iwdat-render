import React, { useState } from "react";
import FileImport from "./FileUploadHandler";
import Grid from "@mui/material/Unstable_Grid2";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box,InputBase,Typography } from "@mui/material";
import PreviewTable from "./TablePreview";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { StyledChip } from "../util/CustomComponents";
import { callDialog } from "../util/CustomDialog";

const ModalContent = styled("div")({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "16px",
  paddingLeft:"40px",
  paddingRight:"40px",
  width: "50vw",
  borderRadius:"10px"
});

export default function DIModalContent({
  uploadedFile,
  setUploadedFile,
  handleCloseModal,
  addTablesToGlobalTableList,
  upload,
}) {
  const [currentTab, setcurrentTab] = useState(0);
  const [checkedTables, setCheckedTables] = useState([]);
  const [tableNames, setTableNames] = useState([]);   

  const handleChange = (event, newValue) => {
    setcurrentTab(newValue);
  };

  const handleFileUploaded = (fileData) => {
    if (upload) {
      setUploadedFile(fileData);
      setCheckedTables([]);
      setTableNames([]);
    }
  };

  const handleCheckboxChange = (event) => {
    const { id } = event.target;
    setCheckedTables((prevcheckedTables) => ({
      ...prevcheckedTables,
      [id]: !prevcheckedTables[id],
    }));
  };

  const handleTableNameChange = (index, value) => {
    setTableNames((prevTableNames) => {
      const updatedTableNames = [...prevTableNames];
      updatedTableNames[index] = value;
      return updatedTableNames;
    });
  };

  const handleConfirmTables = () => {
    if (!upload) {
      callDialog("Before you proceed...", "Are you sure to proceed? Any unselected data will lost FOREVER.", handleImportTables)
    }else{
      handleImportTables();
    }
  };

  function handleImportTables(){
    const selectedTables = Object.keys(checkedTables).reduce(
      (selected, key) => {
        if (checkedTables[key]) {
          const tableName = tableNames[key] || Object.keys(uploadedFile)[key];
          selected[tableName] = uploadedFile[Object.keys(uploadedFile)[key]];
        }
        return selected;
      },
      {}
    );

    if (Object.keys(selectedTables).length !== 0) {
      addTablesToGlobalTableList(selectedTables);
    }

    if (upload) {
      setCheckedTables([]);
      setTableNames([]);
      setUploadedFile(null);
    } else {
      localStorage.removeItem('globalTables');
    }
    handleCloseModal();
  }

  function TabPanel(props) {
    const { children, value, index } = props;
    return (
      <div role="tabpanel" hidden={value !== index}>
        {value === index && <Box sx={{ p: 2, backgroundColor:"#f9f9f9" }}>{children}</Box>}
      </div>
    );
  }

  return (
    <ModalContent>
      <Button
        onClick={handleCloseModal}
        style={{ position: "absolute", top: "8px", right: "8px" }}
      >
        X
      </Button>
      <Grid container spacing={1}>
        <Grid item xs={12} className="file-upload-section">
          {!upload ? (
            <>
              <Typography>
                You have local data made previously, annonymously.
              </Typography>
              <Typography variant="caption">Select which to save.</Typography>
            </>
          ) : (
            <FileImport onFileUploaded={handleFileUploaded} />
          )}
        </Grid>
        {uploadedFile && (
          <>
            <Grid item xs={12}  sx={{pb:0}}>
              <Tabs
                value={currentTab}
                onChange={handleChange}
              >
                {Object.keys(uploadedFile).map((key, index) => (
                  <Tab label={key} index={index} key={key}                 sx={{
                    fontWeight: currentTab === index ? "bold" : "normal", 
                    color: currentTab === index ? "blue" : "black", 
                  }} />
                ))}
              </Tabs>
            </Grid>
            <Grid item xs={12} sx={{ height: "100%", pt:0 }}>
              {Object.keys(uploadedFile).map((key, index) => (
                <TabPanel value={currentTab} index={index}  key={index}>
                  <Grid container alignItems="center" spacing={1} sx={{mb:2}}>
                    <Grid item>
                    <StyledChip
                      label={ checkedTables[index] || false ? "Selected" : "Select"}
                      onClick={() => handleCheckboxChange({ target: { id: index } })}
                      selected={ checkedTables[index] || false}
                    />
                    </Grid>
                    <Grid item>
                      <InputBase
                        defaultValue={tableNames[index] || key}
                        onBlur={(event) =>
                          handleTableNameChange(index, event.target.value)
                        }
                        inputProps={{ "aria-label": "Table name" }}
                        sx={{backgroundColor:"white", p:1, borderRadius:2}}
                      />
                    </Grid>
                  </Grid>
                  <PreviewTable data={uploadedFile[key]} />
                </TabPanel>
              ))}
            </Grid>
            <Grid item xs={12} className="center-item">
              <Button variant="contained" color="six" onClick={handleConfirmTables}>
                Confirm Tables
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </ModalContent>
  );
}
