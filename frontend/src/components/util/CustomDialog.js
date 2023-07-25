import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, Stack } from "@mui/material";
import { useDialog } from "../contexts/DialogContext";

export default function SimpleDialog() {
  const { dialogOpen, dialogTitle, dialogMessage, closeDialog, confirmAction } = useDialog();

  const handleClose = () => {
    closeDialog();
  };

  const handleConfirm = () => {
    confirmAction();
  };

  return (
    <Dialog open={dialogOpen} onClose={handleClose}>
      <Box sx={{ width: "20vw", p: 2 }}>
        <DialogTitle sx={{fontWeight:"bold"}}>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{fontWeight:500}}>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button onClick={handleClose} variant="contained" color="three" sx={{ width: "40%", mr: 4, py:1, borderRadius:2, color:"#74708f", fontWeight:600}}>
            Close
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="one" sx={{ width: "40%", py:1, borderRadius:2, color:'white'}}>
            Confirm
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
