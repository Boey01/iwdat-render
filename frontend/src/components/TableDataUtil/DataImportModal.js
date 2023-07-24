import React, { useState } from "react";
import FileImport from "./FileUploadHandler";
import Grid from "@mui/material/Unstable_Grid2";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Paper, Typography } from "@mui/material";
import PreviewTable from "./TablePreview";
import Input from "@mui/material/Input";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";

const ModalContent = styled("div")({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "16px",
  width: "50vw",
  height:"80vh",
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
    const { id, checked } = event.target;
    const index = id;
    setCheckedTables((prevcheckedTables) => ({
      ...prevcheckedTables,
      [index]: checked,
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
      const confirmDialog = window.confirm(
        "Are you sure? Any unselected data will lost FOREVER."
      );
      if (!confirmDialog) {
        return;
      }
    }
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
  };

  function TabPanel(props) {
    const { children, value, index } = props;
    return (
      <div role="tabpanel" hidden={value !== index}>
        {value === index && <Paper sx={{ p: 2 }}>{children}</Paper>}
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
            <Grid item xs={12}>
              <Tabs
                value={currentTab}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="primary"
              >
                {Object.keys(uploadedFile).map((key, index) => (
                  <Tab label={key} index={index} key={key} />
                ))}
              </Tabs>
            </Grid>
            <Grid item xs={12} sx={{ height: "100%" }}>
              {Object.keys(uploadedFile).map((key, index) => (
                <TabPanel value={currentTab} index={index}  key={index}>
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
                        onBlur={(event) =>
                          handleTableNameChange(index, event.target.value)
                        }
                        inputProps={{ "aria-label": "Table name" }}
                      />
                    </Grid>
                  </Grid>
                  <PreviewTable data={uploadedFile[key]} />
                </TabPanel>
              ))}
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" onClick={handleConfirmTables}>
                Confirm Tables
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </ModalContent>
  );
}
