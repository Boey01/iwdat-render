import React, { useState, useContext, useEffect } from "react";
import Grid from "@mui/material/Grid";
import {
  Box,
  Card,
  Paper,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  TextField,
  Alert,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { GlobalCardContext } from "../contexts/CardContext";
import { GlobalTableContext } from "../contexts/TableContext";
import BarChartIcon from "../../static/bar-chart.svg";
import BarChartPreview from "./BarChart";

const ModalContent = styled("div")({
  position: "absolute",
  backgroundColor: "white",
  padding: "16px",
  width: "60vw",
});

export default function DVModalContent({ handleCloseModal }) {
  const { globalCards } = useContext(GlobalCardContext);
  const { globalTables} = useContext(GlobalTableContext);

  const [tableIndex, setTableIndex] = useState('');  
  const [selectedVO, setSelectedVO] = useState('');

  useEffect(() => {
    console.log("Selected Visual Option:", selectedVO);
  }, [selectedVO]);

  const handleChangeSelectedTable = (event) => {
    const selectedIndex = event.target.value;
    setTableIndex(selectedIndex);

    // if (selectedIndex !== null) {
    //   const selectedTableData = globalTables[selectedIndex].data;
    //   const splitedTable = columnSplitter(selectedTableData);
    //   console.log(splitedTable);
    //   // Do something with the splitedTable data
    // }
  };

  const handleVisualOptionPressed = (option) => {
    setSelectedVO(option)
  }

  const columnSplitter = (tableData) => {
    const columns = {};
  
    // Iterate over each row in the table data
    tableData.forEach((row) => {
      // Iterate over each column in the row
      Object.entries(row).forEach(([columnName, columnValue]) => {
        // Check if the column exists in the columns object
        if (!columns[columnName]) {
          // If not, create an array for the column
          columns[columnName] = [];
        }
  
        // Push the column value to the corresponding array
        columns[columnName].push(columnValue);
      });
    });
  
    return columns;
  };

  const renderVOButton = (optionName, displayText, icon) => {
 return (
   <Paper elevation={2}>
     <ListItem
       disablePadding
       className={selectedVO === optionName ? "vo-selected" : ""}
     >
       <ListItemButton onClick={() => handleVisualOptionPressed(optionName)}>
         <ListItemAvatar>
           <Avatar src={icon} />
         </ListItemAvatar>
         <ListItemText primary={displayText} />
       </ListItemButton>
     </ListItem>
   </Paper>
 );
  }

  return (
    <div className="make-center">
      <ModalContent>
        <Button
          onClick={handleCloseModal}
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
                <List>
                {renderVOButton("bar chart", "Bar Chart", BarChartIcon)}
                </List>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={9}>
            <Stack spacing={2}>
              <div>
                <Typography variant="h5">DataVisualization</Typography>
              </div>
              <FormControl sx={{ width: "50%" }} size="small">
                <InputLabel id="table-selector">Table</InputLabel>
                <Select
                  labelId="table-selector"
                  value={tableIndex}
                  label="Table"
                  onChange={handleChangeSelectedTable}
                >
                   {globalTables.map((table, index) => (
                  <MenuItem value={index}>{table.table_name}</MenuItem>
                   ))}

                </Select>
              </FormControl>
              {tableIndex !== '' && selectedVO !== '' && (
                <BarChartPreview data={globalTables[tableIndex].data} />
              )}
              <Button variant="contained">Create New Table</Button>
            </Stack>
          </Grid>
        </Grid>
      </ModalContent>
    </div>
  );
}
