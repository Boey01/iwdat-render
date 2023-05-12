import React, { useState } from "react";
import { ExcelImport } from "./ExcelFileUploadHandler";
import { Table, Pagination, PaginationItem, PaginationLink } from "reactstrap";

export const ExcelRender = () => {
  const [sheetData, setsheetData] = useState(null);
  const [sheet, setsheet] = useState(null);
  const [sheetNames, setsheetNames] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const PAGE_SIZE = 100;

  const handleFileUploaded = (e) => {
    console.log("File Uploaded", e);
    if(e){ 
        let sheetNames = Object.keys(e);
        setsheetNames(sheetNames);
        setsheet(sheetNames[0])
    }else{
        setsheetNames(null);
    };

    setsheetData(e);
  };

  const handleSheetChange = (e) => {
    setsheet(e.target.value);
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPageLinks = () => {
    if (!sheetData || !sheetData[sheet]) {
      return null;
    }
    const numPages = Math.ceil(sheetData[sheet].length / PAGE_SIZE);
    const links = [];

    for (let i = 0; i < numPages; i++) {
      links.push(
        <PaginationItem key={i} active={i === currentPage}>
          <PaginationLink onClick={() => handlePageChange(i)}>
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return <Pagination>{links}</Pagination>;
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
      <div class="table-content" style={{ maxHeight: tableHeight, overflowY: "auto" }}>
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
    );
  };

  return (
    <div class="content">
      <h2>Excel Table</h2>
      <div class="file-upload">   
                <ExcelImport onFileUploaded={(e) => handleFileUploaded(e)} />
      </div>
      
        {sheetData && (
          <>
                {sheetNames.map((s) => (
                  <div class="change-sheet">
                    <input type="radio" 
                    name="sheetName" 
                    checked= {s === sheet}
                    onChange={(e) => handleSheetChange(e)}
                    value={s} 
                    key={s} />
                    <label>{s}</label>
                  </div>
                ))}

            <div class="table-wrap">
                {renderTable()}
                {renderPageLinks()}
              </div> 
            
          </>
        )}
      
    </div>
  );
};
