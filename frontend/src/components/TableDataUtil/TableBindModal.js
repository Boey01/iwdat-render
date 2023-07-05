import React, { useState, useEffect,useCallback } from "react";
import Grid from "@mui/material/Grid";
import { Box, Card, Paper, Checkbox, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CustomizedAccordions from "./CustomizedAccordians";
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Divider from "@mui/material/Divider";


const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props}/>
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: 0,
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const ModalContent = styled("div")({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "16px",
  width: "60vw",
});


export default function TBModalContent({ handleCloseModal, globalTables }) {
  const [mergedData, setMergedData] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [selectedRowCount, setSelectedRowCount] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);

  useEffect(() => {
    console.log(mergedData)
  }, [mergedData]);

  useEffect(() => {
    if (selectedColumns.length === 0) {
      setSelectedRowCount(null);
    } else {
      mergeTables(selectedColumns);
    }
  }, [selectedColumns]);

  const mergeTables = (selectedColumns) => {
    const mergedData = [];
    
    selectedColumns.forEach((selectedColumn) => {
      const { index, columnName } = selectedColumn;
      const table = globalTables[index];
      
      table.data.forEach((row, rowIndex) => {
        if (!mergedData[rowIndex]) {
          mergedData[rowIndex] = {};
        }
        
        mergedData[rowIndex][columnName] = row[columnName];
      });
    });
    
    setMergedData(mergedData);
  };
  
  
  const handleChange = (index) => (event, newExpanded) => {
    setExpanded(newExpanded ? index : false);
  };

  const handleColumnSelected = (index, column) => (event) => {
    const selectedTableData = globalTables[index].data;
    setSelectedRowCount(selectedTableData.length);

    if (event.target.checked) {
      setSelectedColumns([...selectedColumns, { index: index, columnName: column }]);
    } else {
      setSelectedColumns(selectedColumns.filter((selectedColumn) => selectedColumn.columnName !== column));
    }
  };

  return (
    <ModalContent>
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
            {globalTables.map((data, index) => (
        <Accordion
          expanded={expanded === index}
          onChange={handleChange(index)}
          key={index}
          disabled={ selectedRowCount !== null && data.data.length !== selectedRowCount}
        >
          <AccordionSummary>
            <Typography>{data.name} ({data.data.length} rows)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List disablePadding>
              {Object.keys(data['data'][0]).map((key) => (
                <React.Fragment key={key}>
                  <ListItem disablePadding>
                    <ListItemButton sx={{ p: 0 }}>
                      <Checkbox onChange={handleColumnSelected(index, key)} />
                      <ListItemText primary={key} p />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
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
