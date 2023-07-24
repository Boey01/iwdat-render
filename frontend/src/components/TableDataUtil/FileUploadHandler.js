import React, { useState, useRef } from "react";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import loadFileData from "./DataReader";
import { AiFillDelete } from "react-icons/ai";
import Grid from '@mui/material/Grid'; 
import { StyledToggleButtonGroup } from "../util/CustomComponents";
import { Box, TextField, ToggleButton } from "@mui/material";
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import InsertLinkRoundedIcon from '@mui/icons-material/InsertLinkRounded';

export default function FileImport (props) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [mode, setMode] = useState ("file");

  const fileRef = useRef();

  const handleFile = (e) => {
    const myFile = e.target.files[0];
    if (!myFile) return;

    setFile(myFile);
    setFileName(myFile.name);

  };

  const handleToggleButtonClicked =(event, modeChange) =>{
      if (modeChange !== null) {
        setMode(modeChange);
      }
  
  }
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
        <Typography variant="h4" sx={{ fontWeight: "500", mb:1 }}>
          Import Data
        </Typography>
      </Grid>

      {/* The label for displaying file name */}
      <Grid item xs={12} sx={{mb:0.5}}>
        {fileName ? (
          <Typography>{fileName}</Typography>
        ) : (
          <Typography variant="body2">Please Upload a File</Typography>
        )}
      </Grid>

      {/* Place for uploading file(input) */}
      <Grid item xs={12}>
        <Box  sx={{display:"flex", alignContent:"center", justifyContent:"center"}}>
      <StyledToggleButtonGroup
          size="small"
          value={mode}
          onChange={handleToggleButtonClicked}
          exclusive
        >
          <ToggleButton value="file">
            <UploadFileRoundedIcon />
          </ToggleButton>
          <ToggleButton value="url">
            <InsertLinkRoundedIcon />
          </ToggleButton>
        </StyledToggleButtonGroup>
        {mode === "file" ? (
        <input
          type="file"
          accept="xlsx, xls, csv, json, xml"
          multiple={false}
          onChange={(e) => handleFile(e)}
          ref={fileRef}
        />
        ):(
          <TextField label="Excel File URL" variant="outlined"/>
        )}
        {/* The 'remove file' button */}
        {fileName && (
          <i onClick={handleRemove} className="icon">
            <AiFillDelete />
          </i>
        )}
</Box>
        {/* Read data button */}
        {file && (
          <div>
            <Button onClick={handleReadData} color="primary">
              Read File Data
            </Button>
          </div>
        )}
      </Grid>
    </>
  );
};
