import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { MiniCustomTableContainer } from '../util/CustomComponents';
import { Typography } from '@mui/material';

export default function PreviewTable({ data }) {
  const dataframe = data.slice(1, 6);
  const columns = Object.keys(dataframe[0]);

  return (
    <>
    <MiniCustomTableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((key) => (
              <TableCell sx={{ fontWeight: 'bold' }}>{key}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {dataframe.map((row) => (
            <TableRow>
              {columns.map((key) => (
                <TableCell>{row[key]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MiniCustomTableContainer>
    <Typography variant="caption">Only 5 rows displayed.</Typography>
  </>
  );
}
