import React, { useEffect, useState } from "react";
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
  Chip,
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

export default function BarChartPreview(data) {
  const [targetColumn, setTargetColumn] = useState("");
  const [valueColumns, setValueColumns] = useState([]);
  const [transformedData, setTransformedData] = useState([]);
  const [isGrouped, setIsGrouped] = useState(true); // Initially set to grouped
  const [chartWidth, setChartWidth] = useState(100); 
  const [chartHeight, setChartHeight] = useState(100); 
  
  useEffect(()=>{
    console.log(transformedData); 
  },[transformedData])
  
  useEffect(()=>{
    console.log(valueColumns); 
  },[valueColumns])

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
    setTransformedData(transformedData);
  };

  const handleChartWidthChange = (event, newValue) => {
    setChartWidth(newValue);
  };

  const handleChartHeightChange = (event, newValue) => {
    setChartHeight(newValue);
  };

  return (
    <>
      <Stack>
        <Accordion>
          <AccordionSummary sx={{ m: 0 }}>
            <Typography>Expand option</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2} sx={{mb:1, mt:0.5, overflow:"auto", maxHeight:"20vh"}}>
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
                  <ToggleButton 
                  selected={isGrouped}
                  onChange={() => {
                    setIsGrouped(!isGrouped);
                  }}
                  sx={{ height: 35 }}
                  >Group By </ToggleButton>
              </Grid>
              <Grid item xs={4}></Grid>

              {/* Row 3 */}
              <Grid item xs={12}>
              <Chip
                  label="Add Value"
                  onClick={addNewValueColumn}
                  onDelete={addNewValueColumn}
                  deleteIcon={ <AddIcon />}
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
                      <MenuItem value={"Categorical Count"}>Categorical Count</MenuItem>              
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
        </Grid>
            {/* last Row */}              

            <Button variant="contained" onClick={handleApplyChanges}>
                  Apply Changes
                </Button>
          </AccordionDetails>
        </Accordion>
      </Stack>

      {/* Render the Bar Chart */}
      <Paper sx={{ overflow: "auto" }}>
      {transformedData.length > 0 && (
       <ResponsiveContainer width="100%" aspect={2}>
      <BarChart data={transformedData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey={targetColumn} />
  <YAxis />
  <Tooltip />
  <Legend />
  {Object.keys(transformedData[0]).slice(1).map((key) => (
    <Bar
      key={key}
      dataKey={key}
      fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
    />
  ))}
</BarChart>
</ResponsiveContainer>
 )}

      </Paper>
    </>
  );
}
