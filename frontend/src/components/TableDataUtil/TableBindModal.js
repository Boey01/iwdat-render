import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { Box, Card, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import CustomizedAccordions from "./CustomizedAccordians";

export default function TBModalContent({ handleCloseModal, globalTables }) {
  const ModalContent = styled("div")({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "16px",
    width: "60vw",
  });

  return (
    <ModalContent className="table-preview-modal-content">
      <Button
        onClick={handleCloseModal}
        style={{ position: "absolute", top: "8px", right: "8px" }}
      >
        X
      </Button>

      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Paper variant="outlined" sx={{height:"55vh"}}>
            <Card sx={{ p: 1, height:"12%" }}>
              <Typography>
                Please select the columns from exported tables.
              </Typography>
            </Card>
            <Box sx={{ overflow: "auto", height:"88%"}}>
              <CustomizedAccordions tableList={globalTables} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={9}>
            <Typography variant="h4">Table Preview:</Typography>
            
        </Grid>
      </Grid>
    </ModalContent>
  );
}
