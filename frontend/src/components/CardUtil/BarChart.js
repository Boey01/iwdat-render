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
} from "@mui/material";
import { BarChart } from "recharts";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

export default function BarChartPreview(data) {
  const [targetColumn, setTargetColumn] = useState("");
  const [valueColumns, setValueColumns] = useState([]);

  const handleChange = (event) => {
    setTargetColumn(event.target.value);
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

  return (
    <>
      <Stack>
        <Accordion>
          <AccordionSummary>
            <Typography>Expand option</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography> Taget Column (Variable):</Typography>
                  <Select
                    labelId="column"
                    id="demo-simple-select-standard"
                    value={targetColumn}
                    onChange={handleChange}
                    label="Target Column"
                  >
                    {menuItems}
                  </Select>
              </Grid>

              <Grid item xs={12}>
                <Typography>
                  Values
                  <IconButton onClick={addNewValueColumn} sx={{p:0}}>
                    <AddIcon />
                  </IconButton>
                  :
                </Typography>
              </Grid>
              {valueColumns.map((column, index) => (
                <>
                  <Grid item xs={5} sx={{p:0}}>
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
                  <IconButton onClick={()=>deleteValueColumn(index)}>
                    <DeleteOutlineRoundedIcon/>
                  </IconButton>
                  </Grid>
                  <Grid item xs={3}></Grid>
                </>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </>
  );
}
