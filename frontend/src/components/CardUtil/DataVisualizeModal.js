import React, { useState, useContext, useEffect } from "react";
import Grid from "@mui/material/Grid";
import {
  Box,
  Card,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
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
import { GlobalCardContext } from "../contexts/CardContext";
import { GlobalTableContext } from "../contexts/TableContext";
import BarChartIcon from "../../static/bar-chart.svg";
import LineChartIcon from "../../static/line-chart.svg";
import PieChartIcon from "../../static/pie-chart.svg";
import ScatterPlotIcon from "../../static/scatter-plot.svg";

import BarChartPreview from "./BarChartUtil";
import LineChartPreview from "./LineChartUtil";
import PieChartPreview from "./PieChartUtil";
import ScatterChartPreview from "./ScatterPlotUtil";

const ModalContent = styled("div")({
  position: "absolute",
  backgroundColor: "white",
  padding: "16px",
  width: "60vw",
});

export default function DVModalContent({index, handleCloseModal }) {
  const { globalTables} = useContext(GlobalTableContext);
  const { insertNewVisualization } = useContext(GlobalCardContext);

  const [tableIndex, setTableIndex] = useState('');  
  const [selectedVO, setSelectedVO] = useState('');
  const [visualConfig, setVisualConfig] = useState({});

  useEffect(() => {
    console.log("Selected Visual Option:", selectedVO);
  }, [selectedVO]);

  const handleChangeSelectedTable = (event) => {
    const selectedIndex = event.target.value;
    setTableIndex(selectedIndex);

  };

  const handleVisualOptionPressed = (option) => {
    setSelectedVO(option)
  }

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

  const defineVisualConfig = (chart_type, config) => {
      setVisualConfig({[chart_type]:config});
  }

  const handleInsertNewVisual = () =>{
    const [key, value] = Object.entries(visualConfig)[0];
    insertNewVisualization(index, key, value);
    handleCloseModal();
  }

  const renderPreview = () => {
    switch (selectedVO) {
      case 'bar-chart':
        return <BarChartPreview data={globalTables[tableIndex].data} defineVisualConfig={defineVisualConfig}/>;
      case 'line-chart':
        return <LineChartPreview data={globalTables[tableIndex].data} defineVisualConfig={defineVisualConfig}/>;
      case 'pie-chart':
        return <PieChartPreview data={globalTables[tableIndex].data} defineVisualConfig={defineVisualConfig}/>;
      case 'scatter-plot':
        return <ScatterChartPreview data={globalTables[tableIndex].data} defineVisualConfig={defineVisualConfig}/>;
      default:
        return null;
    }
  };

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
            <Paper variant="outlined" sx={{ height:"100%", minHeight:"50vh" }}>
              <Card sx={{ p: 2, height: "auto", textAlign: "center" }}>
              <FormControl sx={{ width: "100%" }} size="small">
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
              </Card>
              <Box sx={{ overflow: "auto", height: "89%" }}>
                <List>
                {renderVOButton("bar-chart", "Bar Chart", BarChartIcon)}
                {renderVOButton("line-chart", "Line Chart", LineChartIcon)}
                {renderVOButton("pie-chart", "Pie Chart", PieChartIcon)}
                {renderVOButton("scatter-plot", "Scatter Plot", ScatterPlotIcon)}
                </List>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={9}>
            <Stack spacing={2}>
              <div>
                <Typography variant="h5">Data Visualization</Typography>
              </div>
              {tableIndex !== '' && selectedVO !== '' && (
                <>
                  {renderPreview()}
                  <Button variant="contained" onClick={handleInsertNewVisual}>
                    Confirm Data Visualize
                  </Button>
                </>
              )}
            </Stack>
          </Grid>
        </Grid>
      </ModalContent>
    </div>
  );
}
