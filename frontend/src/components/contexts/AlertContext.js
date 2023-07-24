import React, { createContext, useState, useContext } from "react";

const AlertContext = createContext();

export function useAlert() {
  return useContext(AlertContext);
}

export function AlertProvider({ children }) {
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const callAlert = (msg, sev) => {
    setMessage(msg);
    setSeverity(sev);
    setShowAlert(true);
  };

  const alertValue = {
    showAlert,
    message,
    severity,
    callAlert,
    handleCloseAlert,
  };

  return (
    <AlertContext.Provider value={alertValue}>{children}</AlertContext.Provider>
  );
}