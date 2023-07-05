import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";
import Input from "@mui/material/Input";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";

export default function TBModalContent({
  handleCloseModal,
}) {

  const ModalContent = styled("div")({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "16px",
  });

  return (
    <ModalContent className="table-preview-modal-content">
      <Button
        onClick={handleCloseModal}
        style={{ position: "absolute", top: "8px", right: "8px" }}
      >
        X
      </Button>
      <Grid container spacing={1}></Grid>
    </ModalContent>
  );
}
