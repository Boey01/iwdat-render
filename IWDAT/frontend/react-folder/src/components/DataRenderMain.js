import React, { useState } from 'react';
import FileImport from './Tables/FileUploadHandler';
import TableRenderer from './Tables/TableRenderer';
import Grid from '@mui/material/Grid';
import MiniDrawer from './SideBar';
import MakeDraggable from './Draggable';
import ZIndexProvider from './ZIndexContext';
import TableManager from './Tables/TableManager';

export const RendererMain = () => {
  const [sheetData, setSheetData] = useState(null);

  const handleFileUploaded = (e) => {
    console.log('File Uploaded', e);
    if (e) {
      setSheetData(e);
    }
  };

  return (
    <ZIndexProvider>
      <MiniDrawer />
      <TableManager/>
      <div class= "content">
      <Grid container spacing={1}>
        <Grid item xs={12} className="file-upload-section">
          <FileImport onFileUploaded={(e) => handleFileUploaded(e)} />
        </Grid>
        </Grid>
        {sheetData && (
          <div className="table-workspace">
              <MakeDraggable>
                <TableRenderer sheetData={sheetData} />
              </MakeDraggable>

              <MakeDraggable>
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: 'black',
                  }}
                >
                  <p>test</p>
                </div>
              </MakeDraggable>

              {/* Add more <MakeDraggable> components dynamically */}
          </div>
        )}
        </div>
    </ZIndexProvider>
  );
};