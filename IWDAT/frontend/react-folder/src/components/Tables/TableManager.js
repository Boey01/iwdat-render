import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import MakeDraggable from '../Draggable'

const TableManagerButton = styled(Button)({
position: 'fixed',
marginLeft: 100,
})

export default function TableManager() {

  return (
    <MakeDraggable>
    <TableManagerButton variant="contained">Add new table</TableManagerButton>\
    </MakeDraggable>
  );
}