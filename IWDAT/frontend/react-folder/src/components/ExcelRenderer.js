import React, { useState } from "react";
import { ExcelImport } from "./ExcelImportData";
import { Input, Card, CardBody, Row, Col, Table, Label } from "reactstrap";

export const ExcelRender = () => {
    const [sheetData, setsheetData] = useState(null);
    const [sheet, setsheet] = useState(null);
    const [sheetNames, setsheetNames] = useState(null);

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
                  <div>
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
                <Table bordered className="border">
                  <thead>
                    {sheetData[sheet][0].map((h) => (
                      <th>{h}</th>
                    ))}
                  </thead>
                  <tbody>
                    {sheetData[sheet].slice(1).map((row) => (
                      <tr>
                        {row.map((c) => (
                          <td>{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </>
        )}
      </div>
    </div>
  );
};
