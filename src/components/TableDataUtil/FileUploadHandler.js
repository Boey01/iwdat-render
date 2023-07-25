import React, { useState, useRef } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import loadFileData from "./DataReader";
import { AiFillDelete } from "react-icons/ai";
import Grid from "@mui/material/Grid";
import { StyledToggleButtonGroup } from "../util/CustomComponents";
import { Box, TextField, ToggleButton } from "@mui/material";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import InsertLinkRoundedIcon from "@mui/icons-material/InsertLinkRounded";
import InfoIcon from '@mui/icons-material/Info';
import {Tooltip} from "@mui/material";

export default function FileImport(props) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fileURL, setfileURL] = useState("");
  const [mode, setMode] = useState("file");

  const fileRef = useRef();

  const handleFile = (e) => {
    const myFile = e.target.files[0];
    if (!myFile) return;

    setFile(myFile);
    setFileName(myFile.name);
  };

  const handleToggleButtonClicked = (event, modeChange) => {
    if (modeChange !== null) {
      setMode(modeChange);
    }
  };
  const handleRemove = () => {
    setFile(null);
    setFileName(null);

    fileRef.current.value = "";
  };

  const handleReadData = async () => {
    let sheetData;
    if(mode === "file"){
      sheetData = await loadFileData(file);
    }else{
      sheetData = await loadFileData(fileURL);
    }

    if (sheetData) {
      props.onFileUploaded(sheetData);
    }
  };

  return (
    <>
      {/* Title */}
      <Grid item xs={12}>
        <Typography variant="h4" sx={{ fontWeight: "500", mb: 1 }}>
          Import Data 
          <Tooltip title="supported file type: xlsx, xls, xlsm, csv, json, xml">
          <InfoIcon sx={{ml:1}}/>
          </Tooltip>
        </Typography>
      </Grid>

      {/* The label for displaying file name */}
      <Grid item xs={12} sx={{ mb: 0.5, minHeight: "1vh" }}>
        {mode === "file" ? (
          fileName ? (
            <Typography>{fileName}</Typography>
          ) : (
            <Typography variant="body2">Please Upload a File</Typography>
          )
        ) : (
          <Typography> </Typography>
        )}
      </Grid>

      {/* Place for uploading file(input) */}
      <Grid item xs={12}>
        <Box className="center-item">
          {mode === "file" ? (
            <input
              type="file"
              accept="xlsx, xls, csv, json, xml"
              multiple={false}
              onChange={(e) => handleFile(e)}
              ref={fileRef}
            />
          ) : (
            <TextField label="Excel File URL" variant="outlined" size="small" sx={{width:"50%"}} value={fileURL} onChange={(e) => setfileURL(e.target.value)} color="four"/>
          )}
          {/* The 'remove file' button */}
          {mode === "file" && file && (
            <i onClick={handleRemove} className="icon">
              <AiFillDelete />
            </i>
          )}
        </Box>
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
        {/* Read data button */}
        <Box sx={{height:50}} className="center-item">
        {mode === "file" && file && (
            <Button onClick={handleReadData} variant="contained" color="two">
              Read File Data
            </Button>
        )}
        {mode !== "file" && fileURL !== ""  && (
            <Button onClick={handleReadData} variant="contained" color="two">
              Read File Data
            </Button>
        )}
        </Box>
      </Grid>
    </>
  );
}
