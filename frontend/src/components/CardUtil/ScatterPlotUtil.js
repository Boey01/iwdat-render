import React, { useState } from "react";
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
  Paper,
  Popover,
  Tooltip,
  FormControlLabel,
  ToggleButton,
  IconButton,
  InputBase,
  Box,
  Divider,
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

export default function ScatterPlotPreview({ data, defineVisualConfig }) {
  const [scatterData, setScatterData] = useState([]);
  const [scatterSetting, setScatterSetting] = useState([]);
  const [showGrid, setShowGrid] = useState(false);
  const [toggleBtn, setToggleBtn] = useState(() => []);

  React.useEffect(() => {
    console.log(scatterSetting);
  }, [scatterSetting]);

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
        name: null,
        x: { columnName: null, type: "Direct Use", based: null },
        y: { columnName: null, type: "Direct Use", based: null },
      },
    ]);
  };

  const handleScatterNameChange = (e, index) => {
    setScatterSetting((prevScatterSetting) => {
      prevScatterSetting[index].name = e.currentTarget.value;
      return prevScatterSetting;
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
  const handleApplyChanges = () => {};

  return (
    <Stack>
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
            >
              {/* --- Row --- */}
              <Grid item xs={2}>
                <Typography
                  sx={{ fontWeight: "bold", textAlign: "left" }}
                  variant="subtitle2"
                >
                  Scatter Set:
                  <IconButton onClick={addNewScatterSet}>
                    <AddIcon />
                  </IconButton>
                </Typography>
              </Grid>
              <Grid item xs={9}>
                {scatterSetting.length > 0 && (
                  <Box
                    sx={{ backgroundColor: "#f4f4f8", p: 1, borderRadius: 2 }}
                  >
                    {scatterSetting.map((scatter, index) => (
                      <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <IconButton>
                            <DeleteOutlineRoundedIcon />
                          </IconButton>
                          <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Scatter Name"
                            value={scatter.name}
                            onChange={(e) => handleScatterNameChange(e, index)}
                          />
                          <Divider
                            sx={{ height: 28, m: 0.5 }}
                            orientation="vertical"
                          />
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={1}>
                            {/* - - - - X-axis - - - - */}
                            <Grid item xs={1}>
                              <Typography
                                sx={{ fontWeight: "bold", textAlign: "left" }}
                                variant="subtitle2"
                              >
                                X-Axis:
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Select
                                name="x-axis"
                                value={scatter.x.columnName || ""}
                                onChange={(event) =>
                                  handleAxisChange(event, index, 0, 0)
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
                            </Grid>
                            <Grid item xs={3}>
                              <Select
                                name="type"
                                value={scatter.x.type}
                                onChange={(event) =>
                                  handleAxisChange(event, index, 0, 1)
                                }
                                displayEmpty
                                fullWidth
                                sx={{ height: 35 }}
                              >
                                <MenuItem value={"Direct Use"}>
                                  Direct Use
                                </MenuItem>
                                <MenuItem value={"Sum"}>Sum</MenuItem>
                                <MenuItem value={"Count"}>Count</MenuItem>
                                <MenuItem value={"Categorical Count"}>
                                  Categorical Count
                                </MenuItem>
                              </Select>
                            </Grid>
                            <Grid item xs={4}>
                              <Select
                                name="x-axis-based"
                                value={scatter.x.based || ""}
                                onChange={(event) =>
                                  handleAxisChange(event, index, 0, 2)
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
                            </Grid>
                            {/* - - - - Y-axis - - - - */}
                            <Grid item xs={1}>
                              <Typography
                                sx={{ fontWeight: "bold", textAlign: "left" }}
                                variant="subtitle2"
                              >
                                Y-Axis:
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Select
                                name="y-axis"
                                value={scatter.y.columnName || ""}
                                onChange={(event) =>
                                  handleAxisChange(event, index, 1, 0)
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
                            </Grid>
                            <Grid item xs={3}>
                              <Select
                                name="type"
                                value={scatter.y.type}
                                onChange={(event) =>
                                  handleAxisChange(event, index, 1, 1)
                                }
                                displayEmpty
                                fullWidth
                                sx={{ height: 35 }}
                              >
                                <MenuItem value={"Direct Use"}>
                                  Direct Use
                                </MenuItem>
                                <MenuItem value={"Sum"}>Sum</MenuItem>
                                <MenuItem value={"Count"}>Count</MenuItem>
                                <MenuItem value={"Categorical Count"}>
                                  Categorical Count
                                </MenuItem>
                              </Select>
                            </Grid>
                            <Grid item xs={4}>
                              <Select
                                name="y-axis-based"
                                value={scatter.y.based || ""}
                                onChange={(event) =>
                                  handleAxisChange(event, index, 1, 2)
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
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                )}
              </Grid>
              <Grid item xs={1}></Grid>
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
    </Stack>
  );
}
