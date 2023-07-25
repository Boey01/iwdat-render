import React, {useState} from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box } from "@mui/material";
import ReactDOM from "react-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const createColor = (mainColor) => ({ main: mainColor });

const theme = createTheme({
    fontFamily: [
      'Montserrat',
      'sans-serif',
    ].join(','),
  
  palette: {
    one: {main: "#6350f2",contrastText: '#ffffff'},
    two: {main: "#2124ee", contrastText: '#ffffff'},
    three: createColor("#efeff9"),
    four: createColor("#74708f"),
    five: {main: "#DFF250", contrastText: '#050D16'},
    six: {main: "#0062ff", contrastText: '#ffffff'},
  }
});

export function callDialog(title, message, confirmAction) {
  const rootElement = document.getElementById("root");

  const dialogContainer = document.createElement("div");

  dialogContainer.id = "custom-dialog-container";

  rootElement.appendChild(dialogContainer);

  const removeDialogContainer = () => {
    rootElement.removeChild(dialogContainer);
  };

  ReactDOM.render(
    <GlobalDialog
      dialogTitle={title}
      dialogMessage={message}
      confirmAction={confirmAction}
      handleCloseDialog={removeDialogContainer}
    />,
    dialogContainer
  );
}


export default function GlobalDialog({dialogTitle, dialogMessage, confirmAction, handleCloseDialog}) {
  const [showDialog, setShowDialog] = useState(true);

  const handleCloseDialogInternal = () => {
    setShowDialog(false);
    handleCloseDialog(); 
  };

  const handleConfirm = () => {
    confirmAction();
    handleCloseDialogInternal();
  };

  return (
    <ThemeProvider theme={theme}>
    <Dialog open={showDialog} onClose={handleCloseDialogInternal}>
      <Box sx={{ width: "20vw", p: 2 }}>
        <DialogTitle sx={{fontWeight:"bold"}}>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{fontWeight:500}}>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
          <Button onClick={handleCloseDialogInternal} variant="contained" color="three" sx={{ width: "40%", mr: 4, py:1, borderRadius:2, color:"#74708f", fontWeight:600}}>
            Close
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="one" sx={{ width: "40%", py:1, borderRadius:2, color:'white'}}>
            Confirm
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
    </ThemeProvider>
  );
}
