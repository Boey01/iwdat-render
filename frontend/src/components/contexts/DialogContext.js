import React, { createContext, useState, useContext } from "react";

const DialogContext = createContext();

export function useDialog() {
  return useContext(DialogContext);
}

export function DialogProvider({ children }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [confirmFunction, setConfirmFunction] = useState(() => {});

  const openDialog = (title, message, onConfirm) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setConfirmFunction(() => onConfirm);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const confirmAction = () => {
    confirmFunction();
    setDialogOpen(false);
  };

  const dialogValue = {
    dialogOpen,
    dialogTitle,
    dialogMessage,
    openDialog,
    closeDialog,
    confirmAction,
  };

  return (
    <DialogContext.Provider value={dialogValue}>{children}</DialogContext.Provider>
  );
}