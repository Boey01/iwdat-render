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
  const [showGrid, setShowGrid] = useState(false);
  const [toggleBtn, setToggleBtn] = useState(() => []);

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
    setScatterData([...scatterData, { name: null, x: null, y: null }]);

    console.log(scatterData);
  };

  const handleScatterNameChange = (e, index) => {
    setScatterData((prevScatterData) => {
      prevScatterData[index].name = e.currentTarget.value;
      return prevScatterData;
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
              <Grid item xs={3}>
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
              <Grid item xs={8}>
                {scatterData.length > 0 &&
                <Box sx={{ backgroundColor: "#f4f4f8", p: 1, borderRadius: 2 }}>
                  {scatterData.map((scatter, index) => (
                    <Accordion key={index}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <IconButton><DeleteOutlineRoundedIcon /></IconButton>
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
                        {/* Add your details here */}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
}
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
