import React, { useState, useEffect } from "react";
import {
  Accordion as CustomAccordion,
  AccordionDetails as CustomAccordionDetails,
  AccordionSummary as CustomAccordionSummary,
  StyledToggleButtonGroup,
  ColorPickerButton,
} from "../util/CustomComponents";
import {
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
  Button,
  Popover,
  Tooltip,
  ToggleButton,
  IconButton,
  InputBase,
  Box,
  Divider,
  Input,
  FormControl,
  Paper,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import RenderChart from "./RenderChart";
import GridOnIcon from "@mui/icons-material/GridOn";
import GridOffIcon from "@mui/icons-material/GridOff";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { ChromePicker } from "react-color";
import transformingData from "./transformData";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import { callAlert } from "../util/CustomAlert";

export default function ScatterPlotPreview({ data, defineVisualConfig, type }) {
  const [scatterData, setScatterData] = useState([]);
  const [scatterSetting, setScatterSetting] = useState([]);
  const [showGrid, setShowGrid] = useState(false);
  const [toggleBtn, setToggleBtn] = useState(() => []);
  const [focusedScatterIndex, setFocusedScatterIndex] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [axisName, setAxisName] = useState({ x: "", y: "" });
  const [axisUnit, setAxisUnit] = useState({ x: "", y: "" });

  useEffect(() => {
    if (scatterData.length > 0) {
      const compiledConfig = {
        scatterConfig: scatterSetting,
        showGrid: showGrid,
        axisName: axisName,
        axisUnit: axisUnit,
      };

      defineVisualConfig(type, compiledConfig);
    }
  }, [scatterData]);

  const handleToggleButtonClicked = (event, changes) => {
    if (changes.includes("grid")) {
      setShowGrid(!showGrid);
    }
  };

  const menuItems = Object.keys(data[0]).map((key) => (
    <MenuItem value={key} key={key}>
      {key}
    </MenuItem>
  ));

  const addNewScatterSet = () => {
    setScatterSetting([
      ...scatterSetting,
      {
        name: "",
        x: { columnName: null, type: null, based: null, isGrouped: true },
        y: { columnName: null, type: null, based: null, isGrouped: true },
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      },
    ]);
  };

  const handleScatterNameChange = (e, index) => {
    setScatterSetting((prevScatterSetting) => {
      const newName = [...prevScatterSetting];
      newName[index].name = e.target.value;
      return newName;
    });
  };

  const handleAxisChange = (event, index, axis, type) => {
    //axis: 0 = x column, 1= y column.
    //type: 0 =  edit column Name, 1 = edit process type, 2 = edit based

    setScatterSetting((prevScatterSetting) => {
      const updatedScatterSetting = [...prevScatterSetting];
      const selectedValue = event.target.value;

      if (axis === 0) {
        // X-axis
        if (type === 0) {
          updatedScatterSetting[index].x.columnName = selectedValue;
        } else if (type === 1) {
          updatedScatterSetting[index].x.type = selectedValue;
        } else if (type === 2) {
          updatedScatterSetting[index].x.based = selectedValue;
        }
      } else if (axis === 1) {
        // Y-axis
        if (type === 0) {
          updatedScatterSetting[index].y.columnName = selectedValue;
        } else if (type === 1) {
          updatedScatterSetting[index].y.type = selectedValue;
        } else if (type === 2) {
          updatedScatterSetting[index].y.based = selectedValue;
        }
      }

      return updatedScatterSetting;
    });
  };

  const handleColorPickerOpen = (e, index) => {
    setFocusedScatterIndex(index);
    setAnchorEl(e.currentTarget);
  };

  const handleColorPickerClose = () => {
    setAnchorEl(null);
  };

  const handleColorChange = (color) => {
    setScatterSetting((prevScatterSetting) => {
      const newColor = [...prevScatterSetting];
      newColor[focusedScatterIndex].color = color.hex;
      return newColor;
    });
  };

  const handleDeleteScatter = (index) => {
    setScatterSetting((prevScatterSetting) => {
      const updatedScatterSetting = [...prevScatterSetting];
      updatedScatterSetting.splice(index, 1);
      return updatedScatterSetting;
    });
    setFocusedScatterIndex(null);
  };

  const renderColumnSelectBox = (index, axis, type) => {
    //type: 0 = column, 1 = based
    const scatter = scatterSetting[index];

    let axisParam, typeParam, selectName, value;

    if (axis === "x") {
      axisParam = 0;
    } else {
      axisParam = 1;
    }

    if (type === 0) {
      typeParam = 0;
      selectName = axis + "-axis";
      value = scatter[axis].columnName || "";
    } else {
      typeParam = 2;
      selectName = axis + "-axis-based";
      value = scatter[axis].based || "";
    }

    return (
      <Select
        name={selectName}
        value={value}
        onChange={(event) =>
          handleAxisChange(event, index, axisParam, typeParam)
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
        }}
      >
        {menuItems}
      </Select>
    );
  };

  const renderAxisSection = (index, axis) => {
    const scatter = scatterSetting[index];
    return (
      <>
        <Grid item xs={1.5}>
          <Typography
            sx={{ fontWeight: "bold", textAlign: "left" }}
            variant="subtitle2"
          >
            {axis === "x" ? "X-Axis:" : "Y-Axis:"}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          {renderColumnSelectBox(index, axis, 0)}
        </Grid>
        <Grid item xs={2.5}>
          <Select
            name="type"
            value={scatter[axis].type}
            onChange={(event) =>
              handleAxisChange(event, index, axis === "x" ? 0 : 1, 1)
            }
            displayEmpty
            fullWidth
            sx={{ height: 35 }}
          >
            <MenuItem value={"Direct Use"}>Direct Use</MenuItem>
            <MenuItem value={"Sum"}>Sum</MenuItem>
            <MenuItem value={"Count"}>Count</MenuItem>
            <MenuItem value={"Categorical Count"}>Categorical Count</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={3}>
          {renderColumnSelectBox(index, axis, 1)}
        </Grid>
        <Grid item xs={1}>
          <Tooltip title="Group Based Column?" placement="right">
            <ToggleButton
              value="group-by"
              sx={{ p: 0.5 }}
              selected={scatter[axis].isGrouped}
              onChange={() => handleToggleGrouped(index, axis)}
            >
              <CategoryRoundedIcon />
            </ToggleButton>
          </Tooltip>
        </Grid>
      </>
    );
  };

  const renderNameUnitSection = (axis) => {
    return (
      <>
        <Grid item xs={1.5}>
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Typography
              sx={{ fontWeight: "bold", textAlign: "left" }}
              variant="subtitle2"
            >
              {axis === "x" ? "X-Axis:" : "Y-Axis:"}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={10}>
          <Box sx={{ backgroundColor: "#f4f4f8", p: 1, borderRadius: 2 }}>
            <Grid container spacing={1} alignItems={"center"}>
              <Grid item xs={1}>
                <Typography
                  sx={{ fontWeight: "bold", textAlign: "left" }}
                  variant="subtitle2"
                >
                  Name
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <FormControl variant="standard">
                  <Input
                    value={axisName[axis]}
                    onChange={(e) =>
                      setAxisName((prev) => ({
                        ...prev,
                        [axis]: e.target.value,
                      }))
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={1}>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              </Grid>
              <Grid item xs={1}>
                <Typography
                  sx={{ fontWeight: "bold", textAlign: "left" }}
                  variant="subtitle2"
                >
                  Unit
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <FormControl variant="standard">
                  <Input
                    value={axisUnit[axis]}
                    onChange={(e) =>
                      setAxisUnit((prev) => ({
                        ...prev,
                        [axis]: e.target.value,
                      }))
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3}></Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={0.5}></Grid>
      </>
    );
  };

  const handleToggleGrouped = (index, axis) => {
    setScatterSetting((prevScatterSetting) => {
      const newScatter = [...prevScatterSetting];
      newScatter[index][axis].isGrouped = !newScatter[index][axis].isGrouped;
      return newScatter;
    });
  };

  const handleApplyChanges = () => {
    setScatterData([]);
    try {
      scatterSetting.forEach((scatter, index) => {
        let { columnName, type } = scatter.x;
        const valueColumnX = [{ columnName, type }];
        ({ columnName, type } = scatter.y);
        const valueColumnY = [{ columnName, type }];

        const transformedDataX = transformingData(
          data,
          scatter.x.isGrouped,
          scatter.x.based,
          valueColumnX
        );

        const transformedDataY = transformingData(
          data,
          scatter.y.isGrouped,
          scatter.y.based,
          valueColumnY
        );

        if (Object.keys(transformedDataX[0]).length > 1) {
          transformedDataX.forEach((item) => {
            delete item[Object.keys(item)[0]];
          });
        }

        if (Object.keys(transformedDataY[0]).length > 1) {
          transformedDataY.forEach((item) => {
            delete item[Object.keys(item)[0]];
          });
        }

        const combined = [];

        for (let i = 0; i < transformedDataX.length; i++) {
          const newObj = {
            x: Object.values(transformedDataX[i])[0],
            y: Object.values(transformedDataY[i])[0],
          };
          combined.push(newObj);
        }

        setScatterData((prevScatterData) => {
          const newScatter = [...prevScatterData];
          newScatter[index] = combined;
          return newScatter;
        });
      });
    } catch (err) {
      console.log(err);
      callAlert("There is something wrong with the column selection.", "error");
    }
  };

  return (
    <>
        <CustomAccordion>
          <CustomAccordionSummary sx={{ m: 0 }}>
            <Typography>Expand option</Typography>
          </CustomAccordionSummary>
          <CustomAccordionDetails>
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
                alignItems={"center"}
              >
                {/* --- Row --- */}
                <Grid item xs={1.5}>
                  <Typography
                    sx={{ fontWeight: "bold", textAlign: "left" }}
                    variant="subtitle2"
                  >
                    Scatters:
                    <IconButton onClick={addNewScatterSet} sx={{ p: 0 }}>
                      <AddIcon />
                    </IconButton>
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  {scatterSetting.length > 0 && (
                    <Box
                      sx={{ backgroundColor: "#f4f4f8", p: 1, borderRadius: 2 }}
                    >
                      {scatterSetting.map((scatter, index) => (
                        <Accordion key={index}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <InputBase
                              sx={{
                                mx: 1,
                                pl: 1,
                                flex: 1,
                                backgroundColor: "#fafafa",
                                borderRadius: 2,
                              }}
                              placeholder="Scatter Name"
                              value={scatter.name}
                              onChange={(e) =>
                                handleScatterNameChange(e, index)
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Divider
                              sx={{ height: 28, m: 0.5 }}
                              orientation="vertical"
                            />
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid container spacing={0.5} alignItems={"center"}>
                              <Grid item xs={1.5}></Grid>
                              <Grid item xs={4}>
                                {" "}
                                <Typography
                                  sx={{ fontWeight: "bold", textAlign: "left" }}
                                  variant="subtitle2"
                                >
                                  Column:
                                </Typography>
                              </Grid>
                              <Grid item xs={2.5}>
                                {" "}
                                <Typography
                                  sx={{ fontWeight: "bold", textAlign: "left" }}
                                  variant="subtitle2"
                                >
                                  Type:
                                </Typography>
                              </Grid>
                              <Grid item xs={3}>
                                {" "}
                                <Typography
                                  sx={{ fontWeight: "bold", textAlign: "left" }}
                                  variant="subtitle2"
                                >
                                  Group Based Column:
                                </Typography>
                              </Grid>
                              <Grid item xs={1}></Grid>
                              {/* - - - - X-axis - - - - - - - - - - - - */}
                              {renderAxisSection(index, "x")}

                              {/* - - - - Y-axis - - - - - - - - - - - - */}
                              {renderAxisSection(index, "y")}

                              {/* Last Row ---------------- */}
                              <Grid item xs={1.5}>
                                <Typography
                                  sx={{ fontWeight: "bold", textAlign: "left" }}
                                  variant="subtitle2"
                                >
                                  Color:
                                </Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <ColorPickerButton
                                  key={index}
                                  onClick={(e) => {
                                    handleColorPickerOpen(e, index);
                                  }}
                                  bgColor={scatter.color}
                                  size="small"
                                  sx={{
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    width: "100%",
                                    whiteSpace: "nowrap",
                                    textAlign: "center",
                                  }}
                                >
                                  {scatter.name ? scatter.name : "CLICK ME"}
                                </ColorPickerButton>
                              </Grid>
                              <Grid item xs={4.5}></Grid>
                              <Grid
                                item
                                xs={2}
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <IconButton
                                  color="error"
                                  onClick={() => handleDeleteScatter(index)}
                                >
                                  <DeleteOutlineRoundedIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Box>
                  )}
                </Grid>
                <Grid item xs={0.5}></Grid>

                {renderNameUnitSection("x")}
                {renderNameUnitSection("y")}
              </Grid>
            </div>
            <div className="visual-option-bottom-handle">
              <div className="controls-group">
                <Button
                  variant="contained"
                  onClick={handleApplyChanges}
                  sx={{ m: 0 }}
                  color="six"
                >
                  Apply Changes
                </Button>

                <StyledToggleButtonGroup
                  size="small"
                  value={toggleBtn}
                  onChange={handleToggleButtonClicked}
                >
                  <Tooltip title="Enable Grid?" placement="top">
                    <ToggleButton value="grid" selected={showGrid}>
                      {showGrid ? <GridOnIcon /> : <GridOffIcon />}
                    </ToggleButton>
                  </Tooltip>
                </StyledToggleButtonGroup>
              </div>
            </div>
          </CustomAccordionDetails>
        </CustomAccordion>

      <Paper sx={{ overflow: "auto", height: "30vh" }}>
        {scatterData.length > 0 && (
          <RenderChart
            type={type}
            preview={true}
            tableData={scatterData}
            scatterConfig={scatterSetting}
            showGrid={showGrid}
            axisName={axisName}
            axisUnit={axisUnit}
          />
        )}
      </Paper>

      {focusedScatterIndex !== null && (
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
            color={scatterSetting[focusedScatterIndex].color || "#000"}
            onChange={handleColorChange}
          />
        </Popover>
      )}
    </>
  );
}
