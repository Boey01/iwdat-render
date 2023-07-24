import React from "react";
import {Slide, Paper,Alert, Box} from "@mui/material";
import { useAlert } from "../contexts/AlertContext";

export default function SimpleAlert() {
  const { showAlert, message, severity, handleCloseAlert } = useAlert();

  return (
    <Box className="make-center">
    <Slide direction="up" in={showAlert} mountOnEnter unmountOnExit>
      <Paper elevation={3} sx={{position:"absolute",top:"20vh", zIndex:9999}}>
        <Alert severity={severity} onClose={handleCloseAlert}>
          {message}
        </Alert>
      </Paper>
    </Slide>
    </Box>
  );
}
