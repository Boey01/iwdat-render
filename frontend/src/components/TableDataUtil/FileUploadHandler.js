import React, { useState, useRef } from "react";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import loadFileData from "./DataReader";
import { AiFillDelete } from "react-icons/ai";
import Grid from '@mui/material/Unstable_Grid2'; 

export default function FileImport (props) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [mode, setMode] = useState (null);

  const fileRef = useRef();

  const handleFile = (e) => {
    const myFile = e.target.files[0];
    if (!myFile) return;

    setFile(myFile);
    setFileName(myFile.name);

  };

  const handleRemove = () => {
    setFile(null);
    setFileName(null);

    fileRef.current.value = "";
  };

  const handleReadData = async () => {
    const sheetData = await loadFileData(file);

    if (sheetData) {
      props.onFileUploaded(sheetData);
    }
  };

  return (
    <>
    {/* Title */}
    <Grid item xs={12}>
          <Typography variant="h4" sx={{fontWeight:"500"}}>Import Data</Typography>
      </Grid>

    {/* The label for displaying file name */}
    <Grid item xs={12}>

          {fileName ? (
            <Typography>{fileName}</Typography>
          ) : (
            <Typography variant="body2">Please Upload a File</Typography>
          )}

      </Grid>

    {/* Place for uploading file(input) */}
    <Grid item xs={2}></Grid>
    <Grid item xs={10}>
          <input    
            type="file"
            accept="xlsx, xls, csv, json, xml"
            multiple={false}
            onChange={(e) => handleFile(e)}
            ref={fileRef}
          />

          {/* The 'remove file' button */}
          {fileName && (
            <i onClick={handleRemove} className="icon">
              <AiFillDelete />
            </i>
          )}

            {/* Read data button */}
          {file && (
                <div>
                  <Button onClick={handleReadData}  
                  color="primary">Read File Data</Button>
                </div>
          )}
      </Grid>
    </>
  );
};
