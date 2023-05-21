import React, { useState } from "react";
import { ExcelImport } from "./ExcelFileUploadHandler";
import {
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Container,
  Row,
  Col,
  ButtonGroup, 
  Button
} from "reactstrap";

import Grid from '@mui/material/Unstable_Grid2'; 

export const ExcelRender = () => {
  const [sheetData, setsheetData] = useState(null);
  const [sheet, setsheet] = useState(null);
  const [sheetNames, setsheetNames] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const PAGE_SIZE = 100;

  const handleFileUploaded = (e) => {
    console.log("File Uploaded", e);
    if (e) {
      let sheetNames = Object.keys(e);
      setsheetNames(sheetNames);
      setsheet(sheetNames[0]);
    } else {
      setsheetNames(null);
    }

    setsheetData(e);
  };

  const handleSheetChange = (s) => {
    setsheet(s);
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPageLinks = () => {
    if (!sheetData || !sheetData[sheet]) {
      return null;
    }

    const numPages = Math.ceil(sheetData[sheet].length / PAGE_SIZE);

    const handleJumpToPage = (e) => {
      const enteredPage = parseInt(e.target.value, 10) - 1; // Subtract 1 to convert to zero-based index
      if (!isNaN(enteredPage) && enteredPage >= 0 && enteredPage < numPages) {
        setCurrentPage(enteredPage);
      }
    };

    // << < [currentpage] > >> Page [currentpage] of [MaxPage]
    return (
      <Pagination>
        <PaginationItem disabled={currentPage === 0}>
          <PaginationLink onClick={() => handlePageChange(0)}>
            &laquo;
          </PaginationLink>
        </PaginationItem>
        <PaginationItem disabled={currentPage === 0}>
          <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>
            &lt;
          </PaginationLink>
        </PaginationItem>
        <PaginationItem active>
          <PaginationLink>{currentPage + 1}</PaginationLink>
        </PaginationItem>
        <PaginationItem disabled={currentPage === numPages - 1}>
          <PaginationLink onClick={() => handlePageChange(currentPage + 1)}>
            &gt;
          </PaginationLink>
        </PaginationItem>
        <PaginationItem disabled={currentPage === numPages - 1}>
          <PaginationLink onClick={() => handlePageChange(numPages - 1)}>
            &raquo;
          </PaginationLink>
        </PaginationItem>

        <PaginationItem className="page-info">
          <div>
            Page
            <input
              type="number"
              min="1"
              max={numPages}
              value={currentPage + 1}
              onChange={handleJumpToPage}
            />
            of {numPages}
          </div>
        </PaginationItem>
      </Pagination>
    );
  };

  const renderTable = () => {
    if (!sheetData || !sheetData[sheet]) {
      return null;
    }
    const start = currentPage * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const rows = sheetData[sheet].slice(1).slice(start, end);

    const tableHeight = rows.length > 10 ? "80vh" : "auto";

    return (
      <>
      <Grid xs={12}>
  <Grid item className="change-sheet">
    <ButtonGroup>
      {sheetNames.map((s) => (
        <Button
          key={s}
          color={s === sheet ? 'primary' : 'outline-secondary'}
          onClick={() => handleSheetChange(s)}
          active={s === sheet}
        >
          {s}
        </Button>
      ))}
    </ButtonGroup>
  </Grid>
</Grid>

      <div
        class="table-content"
        style={{ maxHeight: tableHeight, overflowY: "auto" }}
      >
        <Table bordered hover>
          <thead>
            <tr>
              {sheetData[sheet][0].map((h, index) => (
                <th key={`header-${index}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {row.map((c, colIndex) => (
                  <td key={`cell-${colIndex}`}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      </>
    );
  };

  return (
    <Grid container spacing={1} className="content">
      <Grid xs={12} className="file-upload-section">
        <Grid item>
          <ExcelImport onFileUploaded={(e) => handleFileUploaded(e)} />
        </Grid>
      </Grid>

      {sheetData && (        

          <div className="table-wrap">
            <Grid xs={12}>
              <Grid item>{renderTable()}</Grid>
            </Grid>

            <Grid xs={12}>
            <Grid item>{renderPageLinks()}</Grid>
            </Grid>
          </div>
      )}
    </Grid>
  );
};
