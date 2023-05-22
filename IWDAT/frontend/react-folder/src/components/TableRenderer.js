import React from "react"
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const CustomTableContainer = styled(TableContainer)({
  maxHeight: '60vh',
  overflowY: 'auto',
  width: '70vw',
});

export const TableRenderer = ({ sheetData }) => {
  let sheetName = [];
  Object.keys(sheetData).forEach((key) => {
    sheetName.push(key);
  });

  const firstRow = sheetData[sheetName[0]][0];

  const columns = [];
  Object.keys(firstRow).forEach((key) => {
    columns.push({
      field: key,
      headerName: key,
    });
  });

  const rows = sheetData[sheetName[0]];

  return (
    <div>
      <CustomTableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field}>{column.headerName}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.field}>{row[column.field]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CustomTableContainer>
    </div>
  );
};
