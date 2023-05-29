import React, { useState } from "react";
import TableCell from "@mui/material/TableCell";
import PropTypes from "prop-types";

export default function EditableTableCell({ value, rowIndex, field, onCellValueChange }) {
    const [isEditing, setIsEditing] = useState(false);
    const [cellValue, setCellValue] = useState(value);
  
    const handleDoubleClick = () => {
      setIsEditing(true);
    };
  
    const handleBlur = () => {
      setIsEditing(false);
      if (cellValue !== value) {
        onCellValueChange(cellValue, rowIndex, field);
      }
    };
  
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        handleBlur();
      }
    };
  
    const handleChange = (event) => {
      setCellValue(event.target.value);
    };
  
    return (
      <TableCell onDoubleClick={handleDoubleClick}>
        {isEditing ? (
          <input
            type="text"
            value={cellValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          value
        )}
      </TableCell>
    );
  }
  
  EditableTableCell.propTypes = {
    value: PropTypes.any.isRequired,
    rowIndex: PropTypes.number.isRequired,
    field: PropTypes.string.isRequired,
    onCellValueChange: PropTypes.func.isRequired,
  };