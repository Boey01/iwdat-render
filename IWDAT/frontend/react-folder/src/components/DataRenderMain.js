import React, { useState } from "react";
import { FileImport } from "./FileUploadHandler";
import { TableRenderer } from "./TableRenderer";
import Grid from '@mui/material/Grid';

export const RendererMain = () => {
  const [sheetData, setSheetData] = useState(null);

  const handleFileUploaded = (e) => {
    console.log("File Uploaded", e);
    if (e) {
      setSheetData(e);
    }
  };

  return (
    <Grid container spacing={1} className="content">
      <Grid item xs={12} className="file-upload-section">
        <FileImport onFileUploaded={(e) => handleFileUploaded(e)} />
      </Grid>

      {sheetData && (
        <div className="table-wrap">
        <Grid xs={12}>
          <TableRenderer sheetData={sheetData} />
        </Grid>
        </div>
      )}
    </Grid>
  );
};