import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { ChromePicker } from "react-color";

export default function BarChartPreview(data) {
  const [targetColumn, setTargetColumn] = useState("");
  const [valueColumns, setValueColumns] = useState([]);
  const [transformedData, setTransformedData] = useState([]);
  const [isGrouped, setIsGrouped] = useState(true); // Initially set to grouped
  const [selectedBarKey, setSelectedBarKey] = useState("");
  const [barColors, setBarColors] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    console.log(transformedData);
  }, [transformedData]);

  useEffect(() => {
    console.log(valueColumns);
  }, [valueColumns]);

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

  const menuItems = Object.keys(data.data[0]).map((key) => (
    <MenuItem value={key} key={key}>
      {key}
    </MenuItem>
  ));

  const transformData = () => {
    if (!targetColumn) {
      return [];
    }

    const transformedData = data.data.reduce((result, item) => {
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
      return data.data.map((item) => ({
        [targetColumn]: item[targetColumn],
        ...item,
      }));
    }
  };

  const handleApplyChanges = () => {
    const transformedData = transformData();
    
    // Generate random colors for each bar
    const newBarColors = {};
    Object.keys(transformedData[0])
      .slice(1)
      .forEach((key) => {
        newBarColors[key] = barColors[key] || `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      });
  
    setTransformedData(transformedData);
    setBarColors(newBarColors); // Update barColors state with new colors
  };
  return (
    <>
      <Stack>
        <Accordion>
          <AccordionSummary sx={{ m: 0 }}>
            <Typography>Expand option</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid
              container
              spacing={2}
              sx={{
                mb: 1,
                mt: 0.5,
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
              <Grid item xs={3}>
              <FormControlLabel
  control={
    <Switch
      checked={isGrouped}
      onChange={() => {
        setIsGrouped(!isGrouped);
      }}
      sx={{ height: 35 }}
    />
  }
  label="Group By" // Replace "Group By" with your desired label text
/>
              </Grid>
              <Grid item xs={4}></Grid>

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
                      {Object.keys(data.data[0])
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
              <Grid item xs={12}>
                <Typography>Legends' Color:</Typography>
                <Stack direction="row" spacing={1} sx={{ overflowX: "auto", p:0.5, border:"1px solid grey", borderRadius: 3 }}>
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
            </Grid>

            <Button
              variant="contained"
              onClick={handleApplyChanges}
              sx={{ m: 1 }}
            >
              Apply Changes
            </Button>
          </AccordionDetails>
        </Accordion>
      </Stack>

      {/* Render the Bar Chart */}
      <Paper sx={{ overflow: "auto", height: "30vh" }}>
        {transformedData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%" >
            <BarChart data={transformedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={targetColumn} />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(transformedData[0])
                .slice(1)
                .map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={
                      barColors[key] 
                    }
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
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
