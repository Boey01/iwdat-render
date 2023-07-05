import React, {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Checkbox, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import Divider from "@mui/material/Divider";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props}/>
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: 0,
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function CustomizedAccordions({ tableList, mergeTables}) {
  const [expanded, setExpanded] = useState(null);
  const [selectedRowCount, setSelectedRowCount] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);

  const handleChange = (index) => (event, newExpanded) => {
    setExpanded(newExpanded ? index : false);
  };

  const handleColumnSelected = (index, column) => (event) => {
    const selectedTableData = tableList[index].data;
    setSelectedRowCount(selectedTableData.length);

    if (event.target.checked) {
      setSelectedColumns([...selectedColumns, { index: index, columnName: column }]);
    } else {
      setSelectedColumns(selectedColumns.filter((selectedColumn) => selectedColumn.columnName !== column));
    }
  };

  useEffect(() => {
    if (selectedColumns.length === 0) {
      setSelectedRowCount(null);
    } else {
      mergeTables(selectedColumns);
    }
  }, [selectedColumns, mergeTables]);
  
  return (
    <>
      {tableList.map((data, index) => (
        <Accordion
          expanded={expanded === index}
          onChange={handleChange(index)}
          key={index}
          disabled={ selectedRowCount !== null && data.data.length !== selectedRowCount}
        >
          <AccordionSummary>
            <Typography>{data.name} ({data.data.length} rows)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List disablePadding>
              {Object.keys(data['data'][0]).map((key) => (
                <React.Fragment key={key}>
                  <ListItem disablePadding>
                    <ListItemButton sx={{ p: 0 }}>
                      <Checkbox onChange={handleColumnSelected(index, key)} />
                      <ListItemText primary={key} p />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}

