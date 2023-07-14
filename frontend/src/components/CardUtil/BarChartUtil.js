import React, { useEffect, useState } from "react";
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
  Switch,
  FormControlLabel,
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

  const transformData = () => {
    if (!targetColumn) {
      return [];
    }

    const transformedData = data.reduce((result, item) => {
      const targetValue = item[targetColumn];
      const existingItem = result.find((d) => d[targetColumn] === targetValue);

      if (existingItem) {
        valueColumns.forEach((column) => {
          const { columnName, type } = column;

          if (type === "Direct Use") {
            existingItem[columnName] = item[columnName];
          } else if (type === "Count") {
            existingItem[columnName]++;
          } else if (type === "Sum") {
            existingItem[columnName] += item[columnName];
          } else if (type === "Categorical Count") {
            // Create a separate bar for each category
            const category = item[columnName];
            if (!existingItem[category]) {
              existingItem[category] = 1;
            } else {
              existingItem[category]++;
            }
          }
        });
      } else {
        const newDataItem = { [targetColumn]: targetValue };

        valueColumns.forEach((column) => {
          const { columnName, type } = column;

          if (type === "Direct Use") {
            newDataItem[columnName] = item[columnName];
          } else if (type === "Count") {
            newDataItem[columnName] = 1;
          } else if (type === "Sum") {
            newDataItem[columnName] = item[columnName];
          } else if (type === "Categorical Count") {
            // Create a separate bar for each category
            const category = item[columnName];
            newDataItem[category] = 1;
          }
        });

        result.push(newDataItem);
      }

      return result;
    }, []);

    if (isGrouped) {
      return transformedData;
    } else {
      return data.map((item, index) => {
        const newItem = { [targetColumn]: item[targetColumn] };
        valueColumns.forEach((column) => {
          const { columnName } = column;

          newItem[columnName] = item[columnName];
        });
        return newItem;
      });
    }
  };

  const handleApplyChanges = () => {
    const transformedData = transformData();
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
                {/* Row 1 */}
                <Grid item xs={12}>
                  <Typography>Target Column (Variable):</Typography>
                </Grid>

                {/* Row 2 */}

                <Grid item xs={5}>
                  <Select
                    color="primary"
                    value={targetColumn}
                    onChange={handleChange}
                    label="Target Column"
                    fullWidth
                    sx={{ height: 35 }}
                  >
                    {menuItems}
                  </Select>
                </Grid>
                <Grid item xs={7}></Grid>
                {/* Row 3 */}
                <Grid item xs={12}>
                  <Chip
                    label="Add Value"
                    onClick={addNewValueColumn}
                    onDelete={addNewValueColumn}
                    deleteIcon={<AddIcon />}
                  />
                </Grid>

                {/* Rows based on valueColumns object */}
                {valueColumns.map((column, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={5}>
                      <Select
                        name="columnName"
                        value={column.columnName}
                        onChange={(event) =>
                          handleValueColumnChange(event, index)
                        }
                        fullWidth
                        sx={{ mx: 1 }}
                        variant="standard"
                      >
                        {Object.keys(data[0])
                          .filter((key) => key !== targetColumn)
                          .map((key) => (
                            <MenuItem key={key} value={key}>
                              {key}
                            </MenuItem>
                          ))}
                      </Select>
                    </Grid>
                    <Grid item xs={3}>
                      <Select
                        name="type"
                        value={column.type}
                        onChange={(event) =>
                          handleValueColumnChange(event, index)
                        }
                        fullWidth
                        variant="standard"
                      >
                        <MenuItem value={"Direct Use"}>Direct Use</MenuItem>
                        <MenuItem value={"Sum"}>Sum</MenuItem>
                        <MenuItem value={"Count"}>Count</MenuItem>
                        <MenuItem value={"Categorical Count"}>
                          Categorical Count
                        </MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton onClick={() => deleteValueColumn(index)}>
                        <DeleteOutlineRoundedIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={3}></Grid>
                  </React.Fragment>
                ))}

                {/* 4th Row */}
                {/* Color Picker Section */}
                {transformedData.length > 0 && (
                  <Grid item xs={12}>
                    <Typography>Legends' Color:</Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        overflowX: "auto",
                        p: 0.5,
                        border: "1px solid grey",
                        borderRadius: 3,
                      }}
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
                )}
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
                <Tooltip title="Target Column Group By?" placement="top">
                <ToggleButton value="group-by" selected={isGrouped}>
                  <CategoryRoundedIcon />
                </ToggleButton>
                </Tooltip>

                  <Tooltip title="Horizontal Layout?" placement="top">
                  <ToggleButton value="horizontal" selected={!horizontal}>
                    <AlignVerticalBottomIcon
                      sx={{
                        transform: horizontal ? "rotate(0deg)" : "rotate(90deg)",
                      }}
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
