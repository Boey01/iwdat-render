import React, { useState, useContext, useEffect } from "react";
import Grid from "@mui/material/Grid";
import {
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Avatar,
  Divider,
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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import BarLinePieChartPreview from "./BLPChartUtil";
import ScatterChartPreview from "./ScatterPlotUtil";
import { connect } from "react-redux";
import { callAlert } from "../util/CustomAlert";

const ModalContent = styled("div")({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "16px",
  width: "65vw",
  borderRadius:10,
});

export function DVModalContent({ index, handleCloseModal, isAuthenticated }) {
  const { globalTables } = useContext(GlobalTableContext);
  const { insertNewVisualization } = useContext(GlobalCardContext);

  const [currentTab, setcurrentTab] = useState(0);
  const [tableIndex, setTableIndex] = useState("");
  const [selectedVO, setSelectedVO] = useState("");
  const [visualConfig, setVisualConfig] = useState({});

  const handleChangeSelectedTable = (event) => {
    const selectedIndex = event.target.value;
    setTableIndex(selectedIndex);
  };

  const handleVisualOptionPressed = (option) => {
    setSelectedVO(option);
  };

  const handleChange = (event, newValue) => {
    setcurrentTab(newValue);
  };

const renderVOCard = (optionName, displayText, icon) => {
    return (
        <div
          className={selectedVO === optionName ? "vo-card vo-selected" : "vo-card"}
          onClick={() => handleVisualOptionPressed(optionName)}
        >
          <Avatar src={icon}  sx={{ width: 56, height: 56}}/>
          <Typography variant="subtitle1" align="center">
            {displayText}
          </Typography>
        </div>
    );
  }

  const defineVisualConfig = (chart_type, config) => {
    setVisualConfig({ [chart_type]: config });
  };

  const handleInsertNewVisual = () => {
   try{ const [key, value] = Object.entries(visualConfig)[0];
    let table_id;
    if (isAuthenticated) {
      table_id = globalTables[tableIndex].table_id;
    } else {
      table_id = tableIndex;
    }
    insertNewVisualization(index, table_id, key, value);
    handleCloseModal();}catch(err){
      callAlert("There is something wrong in visualizing the table.", "error");
    }
  };

  const renderPreview = () => {
    switch (selectedVO) {
      case "bar-chart":
      case "line-chart":
      case "pie-chart":
        return (
          <BarLinePieChartPreview
            data={globalTables[tableIndex].data}
            defineVisualConfig={defineVisualConfig}
            type={selectedVO}
          />
        );
      case "scatter-plot":
        return (
          <ScatterChartPreview
            data={globalTables[tableIndex].data}
            defineVisualConfig={defineVisualConfig}
            type={selectedVO}
          />
        );
      default:
        return null;
    }
  };

  function TabPanel(props) {
    const { children, value, index } = props;
    return (
      <div role="tabpanel" hidden={value !== index}>
        {value === index && <Box sx={{ p: 2, backgroundColor:"#f9f9f9", minHeight:"55vh" }}>{children}</Box>}
      </div>
    );
  }

  return (
    <ModalContent>
      <Button
        onClick={handleCloseModal}
        style={{ position: "absolute", top: "8px", right: "8px" }}
      >
        X
      </Button>
      <div>
        <Typography variant="h5">Data Visualization</Typography>
        <Divider sx={{mt:2}}/>
      </div>
   
      <Tabs value={currentTab} onChange={handleChange}>
        <Tab
          label="Choose"
          value={0} // Set the correct index for the first tab
          sx={{
            fontWeight: currentTab === 0 ? "bold" : "normal",
            color: currentTab === 0 ? "blue" : "black",
          }}
        />
        <Tab
          label="Settings"
          value={1} // Set the correct index for the second tab
          sx={{
            fontWeight: currentTab === 1 ? "bold" : "normal",
            color: currentTab === 1 ? "blue" : "black",
          }}
        />
      </Tabs>
      <TabPanel value={currentTab} index={0}>
  <Paper variant="outlined" sx={{ height: "100%", minHeight: "50vh" }}>
    <Box sx={{ p: 2, height: "auto", textAlign: "center" }}>
      <FormControl sx={{ width: "100%" }} size="small">
        <InputLabel id="table-selector">Table</InputLabel>
        <Select
          labelId="table-selector"
          value={tableIndex}
          label="Table"
          onChange={handleChangeSelectedTable}
          color="six"
        >
          {globalTables.map((table, index) => (
            <MenuItem value={index} key={index}>
              {table.table_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
    <Box sx={{ overflow: "auto", height: "50vh"}}>
      <div className="vo-card-container">
        {renderVOCard("bar-chart", "Bar Chart", BarChartIcon)}
        {renderVOCard("line-chart", "Line Chart", LineChartIcon)}
        {renderVOCard("pie-chart", "Pie Chart", PieChartIcon)}
        {renderVOCard("scatter-plot", "Scatter Plot", ScatterPlotIcon)}
        </div>
    </Box>
  </Paper>
</TabPanel>
      {/* Right section ----------------- */}
      <TabPanel value={currentTab} index={1}>
        <Stack spacing={2}>
          {tableIndex !== "" && selectedVO !== "" && (
            <>
              {renderPreview()}
              <Button variant="contained" onClick={handleInsertNewVisual} color="six">
                Confirm Data Visualize
              </Button>
            </>
          )}
        </Stack>
      </TabPanel>
    </ModalContent>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
});

export default connect(mapStateToProps, {})(DVModalContent);
