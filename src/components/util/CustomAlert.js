import React, { useState} from "react";
import ReactDOM from "react-dom";
import { Slide, Paper, Alert, Box } from "@mui/material";

export function callAlert(message, severity, autoHideDuration = 3000) {
  const rootElement = document.getElementById("root");
  let alertContainer = document.getElementById("custom-alert-container");

  if (!alertContainer) {
    alertContainer = document.createElement("div");
    alertContainer.id = "custom-alert-container";
    rootElement.appendChild(alertContainer);
  }

  const removeAlertContainer = () => {
    const alertContainer = document.getElementById("custom-alert-container");
    if (alertContainer) {
      rootElement.removeChild(alertContainer);
    }
  };

  ReactDOM.render(
    <GlobalAlert
      message={message}
      severity={severity}
      handleCloseAlert={removeAlertContainer}
    />,
    alertContainer
  );

  setTimeout(() => {
    removeAlertContainer();
  }, autoHideDuration);
}

export default function GlobalAlert({ message, severity, handleCloseAlert }) {
  const [showAlert, setShowAlert] = useState(true);

  const handleCloseAlertInternal = () => {
    setShowAlert(false);
    handleCloseAlert(); 
  };
  
  return (
    <Box className="make-center">
      <Slide direction="up" in={showAlert} mountOnEnter unmountOnExit>
        <Paper elevation={3} sx={{ position: "absolute", bottom: "20vh", zIndex: 9999 }}>
          <Alert severity={severity} onClose={handleCloseAlertInternal}>
            {message}
          </Alert>
        </Paper>
      </Slide>
    </Box>
  );
}
