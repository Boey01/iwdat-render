import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../util/CustomComponents";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

export default function BarChartPreview(data) {
  const [targetColumn, setTargetColumn] = useState("");
  const [valueColumns, setValueColumns] = useState([]);
  const [transformedData, setTransformedData] = useState([]);
  const [isGrouped, setIsGrouped] = useState(true); // Initially set to grouped

  const handleChange = (event) => {
    setTargetColumn(event.target.value);
  };

  const handleGroupToggle = (event, newValue) => {
    setIsGrouped(newValue);
  };

  const addNewValueColumn = () => {
    setValueColumns([...valueColumns, { columnName: "", type: "" }]);
  };

  const deleteValueColumn = (index) =>{
    const newValueColumns = [...valueColumns];
    newValueColumns.splice(index, 1);
    setValueColumns(newValueColumns);
  }

  const handleValueColumnChange = (event, index) => {
    const { name, value } = event.target;
    const newColumns = [...valueColumns];
    newColumns[index][name] = value;
    setValueColumns(newColumns);
  };

  const menuItems = Object.keys(data.data[0]).map((key) => (
    <MenuItem value={key}>{key}</MenuItem>
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
    setTransformedData(transformedData);
  };

  return (
    <>
      <Stack>
        <Accordion>
          <AccordionSummary>
            <Typography>Expand option</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0}}>
            <Grid container spacing={2} sx={{ m: 2}}>
            <div className="dv-options-menu">
              <Grid item xs={5}>
                <Typography> Target Column (Variable):</Typography>
                <Select
                  labelId="column"
                  id="demo-simple-select-standard"
                  value={targetColumn}
                  onChange={handleChange}
                  label="Target Column"
                  fullWidth
                >
                  {menuItems}
                </Select>
              </Grid>

              <Grid item xs={3}>
                <Typography>
                  Grouping:
                </Typography>
                <ToggleButtonGroup value={isGrouped} exclusive onChange={handleGroupToggle}>
                  <ToggleButton value={true}>Grouped</ToggleButton>
                  <ToggleButton value={false}>Ungrouped</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={4}></Grid>

              <Grid item xs={12}>
                <Typography>
                  Values
                  <IconButton onClick={addNewValueColumn} sx={{ p: 0 }}>
                    <AddIcon />
                  </IconButton>
                  :
                </Typography>
              </Grid>
              {valueColumns.map((column, index) => (
                <>
                  <Grid item xs={5} sx={{ p: 0 }}>
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
                          <MenuItem value={key}>{key}</MenuItem>
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
                      <MenuItem value={"Count"}>Count</MenuItem>
                      <MenuItem value={"Sum"}>Sum</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton onClick={() => deleteValueColumn(index)}>
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={3}></Grid>
                </>
              ))}
              </div>
              <Grid item xs={12}>
                <Button variant="contained" onClick={handleApplyChanges}>Apply Changes</Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Stack>

      {/* Render the Bar Chart */}
      <Paper sx={{overflow:"auto"}}>
      <BarChart width={500} height={300} data={transformedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={targetColumn} />
        <YAxis />
        <Tooltip />
        <Legend />
        {valueColumns.map((column, index) => (
          <Bar
            key={index}
            dataKey={column.columnName}
            fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
          />
        ))}
      </BarChart>
      </Paper>
    </>
  );
}
