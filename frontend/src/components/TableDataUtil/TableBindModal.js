import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import {
  Box,
  Card,
  Paper,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  TextField,
  Alert,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import PreviewTable from "./TablePreview";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  StrictModeDroppable,
} from "../util/CustomComponents";
import CloseIcon from "@mui/icons-material/Close";

const ModalContent = styled("div")({
  position: "absolute",
  backgroundColor: "white",
  padding: "16px",
  width: "60vw",
});

export default function TBModalContent({
  handleCloseModal,
  globalTables,
  addTablesToGlobalTableList,
}) {
  const [mergedData, setMergedData] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [selectedRowCount, setSelectedRowCount] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [tableName, setTableName] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (selectedColumns.length === 0) {
      setSelectedRowCount(null);
      setMergedData([]);
    } else {
      mergeTables(selectedColumns);
    }
  }, [selectedColumns]);

  const mergeTables = (selectedColumns) => {
    const mergedData = [];

    selectedColumns.forEach((selectedColumn) => {
      const { index, columnName } = selectedColumn;
      const table = globalTables[index];

      table.data.forEach((row, rowIndex) => {
        if (!mergedData[rowIndex]) {
          mergedData[rowIndex] = {};
        }

        mergedData[rowIndex][columnName] = row[columnName];
      });
    });

    setMergedData(mergedData);
  };

  const handleChange = (index) => (event, newExpanded) => {
    setExpanded(newExpanded ? index : false);
  };

  const handleColumnSelected = (index, column) => (event) => {
    const selectedTableData = globalTables[index].data;
    setSelectedRowCount(selectedTableData.length);

    if (event.target.checked) {
      setSelectedColumns([
        ...selectedColumns,
        { index: index, columnName: column },
      ]);
    } else {
      setSelectedColumns(
        selectedColumns.filter(
          (selectedColumn) => selectedColumn.columnName !== column
        )
      );
    }
  };

  const sortColumns = (result) => {
    if (!result.destination) {
      return;
    }

    const columns = Array.from(Object.keys(mergedData[0]));
    const [reorderedColumn] = columns.splice(result.source.index, 1);
    columns.splice(result.destination.index, 0, reorderedColumn);

    const reorderedData = mergedData.map((row) => {
      const reorderedRow = {};
      columns.forEach((column) => {
        reorderedRow[column] = row[column];
      });
      return reorderedRow;
    });

    setMergedData(reorderedData);
  };

  const createNewMergeTable = () => {
    if (!tableName) {
      setShowAlert(true);
      return;
    }

    const newTable ={};
    newTable[tableName] = mergedData;
    addTablesToGlobalTableList(newTable);
    handleCloseModal(1);
  };
  return (
    <div className="make-center">
      <ModalContent>
        <Button
          onClick={() => handleCloseModal(1)}
          style={{ position: "absolute", top: "8px", right: "8px" }}
          >
          X
        </Button>

        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Paper variant="outlined" sx={{ height: "55vh" }}>
              <Card sx={{ p: 2, height: "auto", textAlign: "center" }}>
                <Typography>Exported Tables</Typography>
              </Card>
              <Box sx={{ overflow: "auto", height: "89%" }}>
                {globalTables.map((data, index) => (
                  <Accordion
                    expanded={expanded === index}
                    onChange={handleChange(index)}
                    key={index}
                    disabled={
                      selectedRowCount !== null &&
                      data.data.length !== selectedRowCount
                    }
                  >
                    <AccordionSummary>
                      <Typography>
                        {data.name} ({data.data.length} rows)
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List disablePadding>
                        {Object.keys(data["data"][0]).map((key) => (
                          <>
                            <ListItem disablePadding key={key}>
                              <ListItemButton sx={{ p: 0 }}>
                                <Checkbox
                                  onChange={handleColumnSelected(index, key)}
                                />
                                <ListItemText primary={key} p />
                              </ListItemButton>
                            </ListItem>
                            <Divider />
                          </>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={9}>
            <div className="tb-title-holder">
              <Typography variant="h4">Table Binding</Typography>
            </div>
            <Typography variant="body1">
              {mergedData.length > 0
                ? "Selected Columns:"
                : "No Column Selected."}
            </Typography>
            <Card sx={{ display: "flex", overflow: "auto" }}>
              {mergedData.length > 0 && (
                <DragDropContext onDragEnd={sortColumns}>
                  <StrictModeDroppable
                    droppableId="columns"
                    direction="horizontal"
                  >
                    {(provided) => (
                      <List
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        sx={{ display: "flex", pl: 1, pr: 1 }}
                      >
                        {Object.keys(mergedData[0]).map((column, index) => (
                          <Draggable
                            key={column}
                            draggableId={column}
                            index={index}
                            isDragDisabled={false}
                          >
                            {(provided) => (
                              <ListItem
                                key={column.field}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                disablePadding
                              >
                                <Chip label={column} sx={{ p: 1, m: 0.2 }} />
                              </ListItem>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </List>
                    )}
                  </StrictModeDroppable>
                </DragDropContext>
              )}
            </Card>
            {mergedData.length > 0 && (
              <>
                <Typography variant="caption">
                  {" "}
                  Drag n Drop to sort.{" "}
                </Typography>
                <div>
                  <TextField
                    id="outlined-controlled"
                    label="Table Name"
                    value={tableName}
                    onChange={(event) => {
                      setTableName(event.target.value);
                    }}
                    variant="standard"
                    size="small"
                    sx={{ m: 1 }}
                  />
                  <PreviewTable data={mergedData} />
                </div>
                <div className="tb-title-holder">
                  <Button variant="contained" onClick={createNewMergeTable}>
                    Create New Table
                  </Button>
                </div>
                {showAlert && (
                  <Alert
                    severity="error"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setShowAlert(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                  >
                    Table Name cannot be empty!
                  </Alert>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </ModalContent>
    </div>
  );
}
