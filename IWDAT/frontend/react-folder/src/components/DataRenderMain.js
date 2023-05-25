import React, { useState } from 'react';
import { FileImport } from './FileUploadHandler';
import { TableRenderer } from './TableRenderer';
import Grid from '@mui/material/Grid';
import MiniDrawer from './SideBar';
import MakeDraggable from './Draggable';
import { ZIndexProvider } from './ZIndexContext';

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
      <Grid container spacing={1} className="content">
        <Grid item xs={12} className="file-upload-section">
          <FileImport onFileUploaded={(e) => handleFileUploaded(e)} />
        </Grid>

        {sheetData && (
          <div className="table-workspace">
            <Grid xs={12}>
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
            </Grid>
          </div>
        )}
      </Grid>
    </ZIndexProvider>
  );
};