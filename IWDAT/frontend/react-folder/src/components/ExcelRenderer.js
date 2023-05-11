import React, { useState } from "react";
import { ExcelImport } from "./ExcelFileUploadHandler";
import { Input, Card, CardBody, Row, Col, Table, Label, Pagination, PaginationItem, PaginationLink } from "reactstrap";

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
    const start = currentPage * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const rows = sheetData[sheet].slice(1).slice(start, end);
  
    return (
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
    );
  };

  return (
    <div className="content">
      <h2>Excel Table</h2>
      <>
        <Row>
          <Col md={12}>
            <Card>
              <CardBody>
                <ExcelImport onFileUploaded={(e) => handleFileUploaded(e)} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </>
      <div className="tables">
        {sheetData && (
          <>
            <Row>
              <Col md={12}>
                {sheetNames.map((s) => (
                  <div className="page_nav">
                    <input type="radio" 
                    name="sheetName" 
                    checked= {s === sheet}
                    onChange={(e) => handleSheetChange(e)}
                    value={s} 
                    key={s} />
                    <label>{s}</label>
                  </div>
                ))}
              </Col>
            </Row>
            <Row>
              <Label>{sheet}</Label>
              <Col md={12}>
                {renderTable()}
                {renderPageLinks()}
              </Col>
            </Row>
          </>
        )}
      </div>
    </div>
  );
};
