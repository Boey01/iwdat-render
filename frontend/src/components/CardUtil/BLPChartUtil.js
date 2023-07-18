import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  StyledToggleButtonGroup,
  IOSSwitch,
  ColorPickerButton,
} from "../util/CustomComponents";
import {
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
  Button,
  Paper,
  Popover,
  Tooltip,
  FormControlLabel,
  IconButton,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { ChromePicker } from "react-color";
import AlignVerticalBottomIcon from "@mui/icons-material/AlignVerticalBottom";
import RenderChart from "./RenderChart";
import GridOnIcon from "@mui/icons-material/GridOn";
import GridOffIcon from "@mui/icons-material/GridOff";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import ToggleButton from "@mui/material/ToggleButton";
import transformingData from "./transformData";

export default function BarLinePieChartPreview({
  data,
  defineVisualConfig,
  type,
}) {
  const [targetColumn, setTargetColumn] = useState(""); //target columnn
  const [valueColumns, setValueColumns] = useState([{ columnName: "", type: "" },]); //value columnns
  const [transformedData, setTransformedData] = useState([]); //processed data to favor Rechart libarary
  const [isGrouped, setIsGrouped] = useState(true);            //categorized target column?
  const [selectedBarKey, setSelectedBarKey] = useState("");   //to determine which element's color to show in color picker
  const [columnColors, setColumnColors] = useState({});       //record each element's color
  const [anchorEl, setAnchorEl] = useState(null);             //to make color picker appear under the buttonn
  const [horizontal, setHorizontal] = useState(true);         //to determie the layout alignment
  const [showGrid, setShowGrid] = useState(false);            //enable grid?
  const [toggleBtn, setToggleBtn] = useState(() => []);       // to determine which toggle btn is toggled in the toggle btn group
  const [dot, setDot] = useState(false);                      // to enable dot for line chart, label for pie
  const [hollow, setHollow] = useState(false);                //to make the dot/pie hollow
  const [legendRight, setLegendRight] = useState(true);       // to align the legend for pie right side

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

  const handleColorPickerOpen = (event, key) => {
    setSelectedBarKey(key);
    setAnchorEl(event.currentTarget);
  };

  const handleColorPickerClose = () => {
    setAnchorEl(null);
  };

  const handleColorChange = (color) => {
    setColumnColors({ ...columnColors, [selectedBarKey]: color.hex });
  };

  const menuItems = Object.keys(data[0]).map((key) => (
    <MenuItem value={key} key={key}>
      {key}
    </MenuItem>
  ));

  const handleApplyChanges = () => {
    const newTransformedData = transformingData(
      data,
      isGrouped,
      targetColumn,
      valueColumns
    );
    // Generate random colors for each bar
    const newColumnColors = {};

    if (type !== "pie-chart") {
      Object.keys(newTransformedData[0])
        .slice(1)
        .forEach((key) => {
          newColumnColors[key] =
            columnColors[key] ||
            `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        });
    } else {
      newTransformedData.forEach((data) => {
        const firstKey = Object.values(data)[0];
        newColumnColors[firstKey] =
          columnColors[firstKey] ||
          `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      });
    }

    setTransformedData(newTransformedData);
    setColumnColors(newColumnColors); // Update columnColors state with new colors

    const compiledConfig = {
      data: newTransformedData,
      dataKey: targetColumn,
      horizontal: horizontal,
      colors: newColumnColors,
      title: "",
      showGrid: showGrid,
      ...(type === "line-chart" && { dot: dot, hollow: hollow }),
      ...(type === "pie-chart" && { label:dot, hollow: hollow, legendRight:legendRight }),
    };

    defineVisualConfig(type, compiledConfig);
  };
  
  return (
    <>
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
                  sx={{ fontWeight: "bold", textAlign: "left" }}
                  variant="subtitle2"
                >
                  Define a Target Column:
                </Typography>
              </Grid>
              <Grid item xs={8}>
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
              <Grid item xs={1}></Grid>
              {/* --- Row --- */}
              <Grid item xs={3}>
                <Box
                  sx={
                    type === "pie-chart" && {
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                    }
                  }
                >
                  <Typography
                    sx={{ fontWeight: "bold", textAlign: "left" }}
                    variant="subtitle2"
                  >
                    Define Value Column:
                    {type !== "pie-chart" && (
                      <IconButton onClick={addNewValueColumn}>
                        <AddIcon />
                      </IconButton>
                    )}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={8}>
                {valueColumns.length > 0 && (
                  <Box
                    sx={{ backgroundColor: "#f4f4f8", p: 1, borderRadius: 2 }}
                  >
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
                            sx={{
                              mr: 1,
                              height: 35,
                              fontWeight: "bold",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}>
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
                            {type !== "pie-chart" && (
                              <MenuItem value={"Categorical Count"}>
                                Categorical Count
                              </MenuItem>
                            )}
                          </Select>

                          {type !== "pie-chart" && (
                            <IconButton
                              onClick={() => deleteValueColumn(index)}
                            >
                              <DeleteOutlineRoundedIcon />
                            </IconButton>
                          )}
                        </Stack>
                        <Grid item xs={1}></Grid>
                      </React.Fragment>
                    ))}
                  </Box>
                )}
              </Grid>
              <Grid item xs={1}></Grid>
              {/* --- Row --- */}
              <Grid item xs={3}>
                <Typography
                  sx={{ fontWeight: "bold", textAlign: "left", pt: 1.2 }}
                  variant="subtitle2"
                >
                  {type === "bar-chart" && "Bars' Color:"}
                  {type === "line-chart" && "Line's Color:"}
                  {type === "pie-chart" && "Cell's Color:"}
                </Typography>
              </Grid>
              <Grid item xs={8} sx={{ p: 0 }}>
                <Stack
                  spacing={{ xs: 1, sm: 2 }}
                  direction="row"
                  useFlexGap
                  flexWrap="wrap"
                  sx={{ p: 1 }}
                >
                  {transformedData.length > 0 &&
                    (type !== "pie-chart"
                      ? Object.keys(transformedData[0])
                          .slice(1)
                          .map((key) => (
                            <ColorPickerButton
                              key={key}
                              onClick={(e) => {
                                handleColorPickerOpen(e, key);
                              }}
                              bgColor={columnColors[key]}
                              size="small"
                            >
                              {key}
                            </ColorPickerButton>
                          ))
                      : transformedData.map((data) => {
                          const firstKey = Object.values(data)[0];
                          return (
                            <ColorPickerButton
                              key={firstKey}
                              onClick={(e) => {
                                handleColorPickerOpen(e, firstKey);
                              }}
                              bgColor={columnColors[firstKey]}
                              size="small"
                            >
                              {firstKey}
                            </ColorPickerButton>
                          );
                        }))}
                </Stack>
              </Grid>
              <Grid item xs={1}></Grid>
              {/* --- Row --- */}
              {type !== "bar-chart" && (
                <>
                  <Grid item xs={3}>
                    <Typography
                      sx={{ fontWeight: "bold", textAlign: "left" }}
                      variant="subtitle2"
                    >
                     {type === "line-chart" ?"Dot:":"Additional Option" }
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Stack direction="row" sx={{ pl: 2 }}>
                      <FormControlLabel
                        control={
                          <IOSSwitch
                            checked={dot}
                            onChange={() => {
                              setDot(!dot);
                            }}
                          />
                        }
                        label={
                          <Typography variant="caption">
                            Enable{type === "line-chart" ?" Dot?":" Label?" }
                            </Typography>
                        }
                      />

                      <FormControlLabel
                        control={
                          <IOSSwitch
                            checked={hollow}
                            onChange={() => {
                              setHollow(!hollow);
                            }}
                            disabled={type==="line-chart"&&!dot}
                          />
                        }
                        label={
                          <Typography variant="caption">Hollow?</Typography>
                        }
                      />
                  {type === "pie-chart" && (
                     <FormControlLabel
                        control={
                          <IOSSwitch
                            checked={legendRight}
                            onChange={() => {
                              setLegendRight(!legendRight);
                            }}
                          />
                        }
                        label={
                          <Typography variant="caption">Legend Vertical?</Typography>
                        }
                      />
                  )}

                    </Stack>
                  </Grid>
                  <Grid item xs={1}></Grid>
                </>
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
                <Tooltip title="Group Target Column?" placement="top">
                  <ToggleButton value="group-by" selected={isGrouped}>
                    <CategoryRoundedIcon />
                  </ToggleButton>
                </Tooltip>

                {type !== "pie-chart" && (
                  <Tooltip title="Horizontal Layout?" placement="top">
                    <ToggleButton value="horizontal" selected={!horizontal}>
                      <AlignVerticalBottomIcon
                        className={
                          horizontal
                            ? "layout-icon layout-horizontal"
                            : "layout-icon layout-vertical"
                        }
                      />
                    </ToggleButton>
                  </Tooltip>
                )}
                {type !== "pie-chart" && (
                  <Tooltip title="Enable Grid?" placement="top">
                    <ToggleButton value="grid" selected={showGrid}>
                      {showGrid ? <GridOnIcon /> : <GridOffIcon />}
                    </ToggleButton>
                  </Tooltip>
                )}
              </StyledToggleButtonGroup>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* Render the Chart */}
      <Paper sx={{ overflow: "auto", height: "30vh" }}>
        {transformedData.length > 0 && (
          <RenderChart
            type={type}
            data={transformedData}
            dataKey={targetColumn}
            horizontal={horizontal}
            colors={columnColors}
            showGrid={showGrid}
            {...(type === "line-chart" && { dot: dot, hollow: hollow })}
            {...(type === "pie-chart" && { label:dot, hollow: hollow, legendRight:legendRight })}
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
          color={columnColors[selectedBarKey] || "#000"}
          onChange={handleColorChange}
        />
      </Popover>
    </>
  );
}
