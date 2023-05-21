import React, { useState } from "react";
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export const TableRenderer = ({ sheetData }) => {
    let sheetName = [];
    Object.keys(sheetData).forEach((key) => {
       sheetName.push(key);
    })

    const firstRow = sheetData[sheetName[0]][0];

    const columns = [];
    Object.keys(firstRow).forEach((key) => {
        columns.push({
            field: key,
            headerName : key
        })
     })

     const rows = sheetData[sheetName[0]];
  
    return (
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          checkboxSelection
        />
      </div>
    );
  };