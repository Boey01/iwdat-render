import React, { useState, useRef } from "react";
import { Row, Col, Label, Button } from "reactstrap";
import loadFileData from "./ExcelDataReader";
import { AiFillDelete } from "react-icons/ai";
import Grid from '@mui/material/Unstable_Grid2'; 

export const ExcelImport = (props) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [sheetData, setSheetData] = useState(null);

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
    setSheetData(null);

    fileRef.current.value = "";
  };

  const handleReadData = async () => {
    const sheetData = await loadFileData(file);

    if (sheetData) {
      setSheetData(sheetData);
      props.onFileUploaded(sheetData);
    }
  };

  return (
    <>
    {/* Title */}
    <Grid xs={12}>
        <Grid item>
          <h2>Excel Table</h2>
        </Grid>
      </Grid>

    {/* The labelk for displaying file name */}
    <Grid xs={12}>
        <Grid item>
          {fileName ? (
            <Label>{fileName}</Label>
          ) : (
            <Label>Please Upload a File</Label>
          )}
         </Grid>
      </Grid>

    {/* Place for uploading file(input) */}
    <Grid xs={12}>
        <Grid item>
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
                  color="primary">Read Excel Data</Button>
                </div>
          )}
         </Grid>
      </Grid>
    </>
  );
};
