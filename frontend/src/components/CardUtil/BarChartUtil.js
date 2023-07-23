import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  StyledToggleButtonGroup,
} from "../util/CustomComponents";
import {
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
  Button,
  Paper,
  Chip,
  Popover,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { ChromePicker } from "react-color";
import AlignVerticalBottomIcon from "@mui/icons-material/AlignVerticalBottom";
import RenderChart from "./RenderChart";
import GridOnIcon from "@mui/icons-material/GridOn";
import GridOffIcon from "@mui/icons-material/GridOff";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import ToggleButton from "@mui/material/ToggleButton";
import transformingData from "./transformData";

export default function BarChartPreview({ data, defineVisualConfig }) {
  const [targetColumn, setTargetColumn] = useState("");
  const [valueColumns, setValueColumns] = useState([]);
  const [transformedData, setTransformedData] = useState([]);
  const [isGrouped, setIsGrouped] = useState(true); // Initially set to grouped
  const [selectedBarKey, setSelectedBarKey] = useState("");
  const [barColors, setBarColors] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [horizontal, setHorizontal] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [toggleBtn, setToggleBtn] = useState(() => []);

  const handleToggleButtonClicked = (event, changes) => {
    if (changes.includes("group-by")) {
      setIsGrouped(!isGrouped);
    }
    if (changes.includes("horizontal")) {
      setHorizontal(!horizontal);
    }
    if (changes.includes("grid")) {
      setShowGrid(!showGrid);
    }
  };
  
  const handleChange = (event) => {
    setTargetColumn(event.target.value);
  };

  const addNewValueColumn = () => {
    setValueColumns([...valueColumns, { columnName: "", type: "" }]);
  };

  const deleteValueColumn = (index) => {
    const newValueColumns = [...valueColumns];
    newValueColumns.splice(index, 1);
    setValueColumns(newValueColumns);
  };

  const handleValueColumnChange = (event, index) => {
    const { name, value } = event.target;
    const newColumns = [...valueColumns];
    newColumns[index][name] = value;
    setValueColumns(newColumns);
  };

  function handleColorPickerOpen(event, key) {
    setSelectedBarKey(key);
    setAnchorEl(event.currentTarget);
  }

  const handleColorPickerClose = () => {
    setAnchorEl(null);
  };

  const handleColorChange = (color) => {
    setBarColors({ ...barColors, [selectedBarKey]: color.hex });
  };

  const menuItems = Object.keys(data[0]).map((key) => (
    <MenuItem value={key} key={key}>
      {key}
    </MenuItem>
  ));

  const handleApplyChanges = () => {
    const transformedData = transformingData(
      data,
      isGrouped,
      targetColumn,
      valueColumns
    );
    console.log(transformedData);
    // Generate random colors for each bar
    const newBarColors = {};
    Object.keys(transformedData[0])
      .slice(1)
      .forEach((key) => {
        newBarColors[key] =
          barColors[key] ||
          `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      });

    setTransformedData(transformedData);
    setBarColors(newBarColors); // Update barColors state with new colors

    const compiledConfig = {
      data: transformedData,
      dataKey: targetColumn,
      horizontal: horizontal,
      colors: newBarColors,
      title: "",
      showGrid: showGrid,
    };
    defineVisualConfig("bar-chart", compiledConfig);
  };
  return (
    <>
      <Stack>
        <Accordion>
          <AccordionSummary sx={{ m: 0 }}>
            <Typography>Expand option</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <div className="visual-option-menu">
              <Grid
                container
                spacing={2}
                sx={{
                  mt: 0.1,
                  pl: 1,
                  overflow: "auto",
                  maxHeight: "20vh",
                }}
              >
                {/* --- Row --- */}
                <Grid item xs={3}>
                  <Typography
                    sx={{ fontWeight: "bold", textAlign: "center", pt: 0.5 }}
                    variant="subtitle2"
                  >
                    Define a Target Column:
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Select
                    value={targetColumn}
                    onChange={handleChange}
                    displayEmpty
                    fullWidth
                    sx={{ height: 35, fontWeight: "bold" }}
                  >
                    {menuItems}
                  </Select>
                </Grid>
                <Grid item xs={2}></Grid>
                {/* --- Row --- */}
                <Grid item xs={3}>
                  <Typography
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                    variant="subtitle2"
                  >
                    Define Value Column:
                    <IconButton onClick={addNewValueColumn}>
                      <AddIcon />
                    </IconButton>
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  {valueColumns.map((column, index) => (
                    <React.Fragment key={index}>
                      <Stack direction="row">
                        <Select
                          name="columnName"
                          value={column.columnName}
                          onChange={(event) =>
                            handleValueColumnChange(event, index)
                          }
                          displayEmpty
                          fullWidth
                          sx={{ mr: 1, height: 35, fontWeight: "bold" }}
                        >
                          {Object.keys(data[0])
                            .filter((key) => key !== targetColumn)
                            .map((key) => (
                              <MenuItem key={key} value={key}>
                                {key}
                              </MenuItem>
                            ))}
                        </Select>

                        <Select
                          name="type"
                          value={column.type}
                          onChange={(event) =>
                            handleValueColumnChange(event, index)
                          }
                          displayEmpty
                          fullWidth
                          sx={{ height: 35 }}
                        >
                          <MenuItem value={"Direct Use"}>Direct Use</MenuItem>
                          <MenuItem value={"Sum"}>Sum</MenuItem>
                          <MenuItem value={"Count"}>Count</MenuItem>
                          <MenuItem value={"Categorical Count"}>
                            Categorical Count
                          </MenuItem>
                        </Select>

                        <IconButton onClick={() => deleteValueColumn(index)}>
                          <DeleteOutlineRoundedIcon />
                        </IconButton>
                      </Stack>
                      <Grid item xs={3}></Grid>
                    </React.Fragment>
                  ))}
                </Grid>
                <Grid item xs={2}></Grid>
                {/* --- Row --- */}
                <Grid item xs={3}>
                  <Typography
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                    variant="subtitle2"
                  >
                    Legends' Color:
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Stack
                    spacing={{ xs: 1, sm: 2 }}
                    direction="row"
                    useFlexGap
                    flexWrap="wrap"
                    sx={{ overflowY: "auto" }}
                  >
                    {transformedData.length > 0 &&
                      Object.keys(transformedData[0])
                        .slice(1)
                        .map((key) => (
                          <Chip
                            key={key}
                            label={key}
                            onClick={(e) => {
                              handleColorPickerOpen(e, key);
                            }}
                            sx={{
                              backgroundColor: barColors[key] || "grey",
                              color: "#FFF",
                              boxShadow: 2,
                            }}
                          />
                        ))}
                  </Stack>
                </Grid>
                <Grid item xs={2}></Grid>
              </Grid>
            </div>

            <div className="visual-option-bottom-handle">
              <div className="controls-group">
                <Button
                  variant="contained"
                  onClick={handleApplyChanges}
                  sx={{ m: 0 }}
                >
                  Apply Changes
                </Button>

                <StyledToggleButtonGroup
                  size="small"
                  value={toggleBtn}
                  onChange={handleToggleButtonClicked}
                >
                  <Tooltip title="Group Target Column?" placement="top">
                    <ToggleButton value="group-by" selected={isGrouped}>
                      <CategoryRoundedIcon />
                    </ToggleButton>
                  </Tooltip>

                  <Tooltip title="Horizontal Layout?" placement="top">
                    <ToggleButton value="horizontal" selected={!horizontal}>
                      <AlignVerticalBottomIcon
                        className={
                          horizontal ? "layout-icon layout-horizontal" : "layout-icon layout-vertical"
                        }
                      />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="Enable Grid?" placement="top">
                    <ToggleButton value="grid" selected={showGrid}>
                      {showGrid ? <GridOnIcon /> : <GridOffIcon />}
                    </ToggleButton>
                  </Tooltip>
                </StyledToggleButtonGroup>
              </div>
            </div>
            
          </AccordionDetails>
        </Accordion>
      </Stack>

      {/* Render the Bar Chart */}
      <Paper sx={{ overflow: "auto", height: "30vh" }}>
        {transformedData.length > 0 && (
          <RenderChart
            type="bar-chart"
            data={transformedData}
            dataKey={targetColumn}
            horizontal={horizontal}
            colors={barColors}
            showGrid={showGrid}
          />
        )}
      </Paper>

      {/* Color Picker Dialog */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleColorPickerClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <ChromePicker
          color={barColors[selectedBarKey] || "#000"}
          onChange={handleColorChange}
        />
      </Popover>
    </>
  );
}
