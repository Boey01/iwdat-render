import React, { useState } from "react";
import { FileImport } from "./FileUploadHandler";
import { TableRenderer } from "./TableRenderer";
import Grid from '@mui/material/Grid';
import MiniDrawer from "./SideBar";

export const RendererMain = () => {
  const [sheetData, setSheetData] = useState(null);

  const handleFileUploaded = (e) => {
    console.log("File Uploaded", e);
    if (e) {
      setSheetData(e);
    }
  };

  return (
    <>
    <MiniDrawer/>
    <Grid container spacing={1} className="content">
      <Grid item xs={12} className="file-upload-section">
        <FileImport onFileUploaded={(e) => handleFileUploaded(e)} />
      </Grid>

      {sheetData && (
        <div className="table-workspace">
        <Grid xs={12}>
          <TableRenderer sheetData={sheetData} />
        </Grid>
        </div>
      )}
    </Grid>
    </>
  );
};