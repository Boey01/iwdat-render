import React, { useState, useEffect } from "react";
import TableCell from "@mui/material/TableCell";
import PropTypes from "prop-types";

function EditableTableCell({
  value,
  rowIndex,
  field,
  onCellValueChange,
  page,
  rowsPerPage,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [cellValue, setCellValue] = useState(value);

  useEffect(() => {
    setCellValue(value);  
  }, [value]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);

    if (cellValue !== value) {
      const actualRowIndex = page * rowsPerPage + rowIndex;
      let convertedValue = Number(cellValue);
      if (isNaN(convertedValue)) {
        convertedValue = cellValue;
      }

      onCellValueChange(convertedValue, actualRowIndex, field);
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
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default React.memo(EditableTableCell);
