import React, { useState, useEffect,useCallback } from "react";
import Grid from "@mui/material/Grid";
import { Box, Card, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import CustomizedAccordions from "./CustomizedAccordians";

export default function TBModalContent({ handleCloseModal, globalTables }) {
  const [mergedData, setMergedData] = useState([]);

  const mergeTables = useCallback((selectedColumns) => {
    const newMergedTables = selectedColumns.map(({ index, columnName }) => {
      const selectedTableData = globalTables[index].data;
      const mergedTable = selectedTableData.map((row) => ({
        [columnName]: row[columnName],
      }));
      return mergedTable;
    });
  
    setMergedData(newMergedTables);
  
  }, []); 

  useEffect(() => {
    console.log(mergedData)
  }, [mergedData]);

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
        onClick={()=>(handleCloseModal(1))}
        style={{ position: "absolute", top: "8px", right: "8px" }}
      >
        X
      </Button>

      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Paper variant="outlined" sx={{ height: "55vh" }}>
            <Card sx={{ p: 2, height: "auto", textAlign: "center" }}>
              <Typography>Exported Tables</Typography>
            </Card>
            <Box sx={{ overflow: "auto", height: "89%" }}>
              <CustomizedAccordions
                tableList={globalTables}
                mergeTables={mergeTables}
              />
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
