import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import MakeDraggable from '../Draggable';
import Modal from '@mui/material/Modal';
import FileImport from './FileUploadHandler';
import Grid from '@mui/material/Grid';
import TableRenderer from './TableRenderer';

const TableManagerButton = styled(Button)({
  left: '10vw',
});

const ModalContent = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '16px',
});

export default function TableManager() {
  const [open, setOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileUploaded = (fileData) => {
    const newFiles = [...uploadedFiles, fileData];
    setUploadedFiles(newFiles);
    handleClose();
  };

  return (
    <>
      <MakeDraggable>
        <TableManagerButton variant="contained" onClick={handleOpen}>
          Add new table
        </TableManagerButton>
      </MakeDraggable>

      <Modal open={open} onClose={handleClose}>
        <ModalContent>
          <Button onClick={handleClose} style={{ position: 'absolute', top: '8px', right: '8px' }}>
            X
          </Button>
          <Grid container spacing={1}>
            <Grid item xs={12} className="file-upload-section">
              <FileImport onFileUploaded={handleFileUploaded} />
            </Grid>
          </Grid>
        </ModalContent>
      </Modal>

      
      {uploadedFiles.map((fileData, index) => (
        <div key={index} className="table-workspace">
          <MakeDraggable>
            <TableRenderer sheetData={fileData} />
          </MakeDraggable>
        </div>
      ))}
    </>
  );
}
