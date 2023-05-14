import React, { useState, useRef } from "react";
import { Row, Col, Label, Button } from "reactstrap";
import loadFileData from "./ExcelDataReader";
import { AiFillDelete } from "react-icons/ai";

export const ExcelImport = (props) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [sheetData, setSheetData] = useState(null);

  const fileRef = useRef();

  const handleFile = (e) => {
    const myFile = e.target.files[0];
    if (!myFile) return;

    setFile(myFile);
    setFileName(myFile.name);
  };

  const handleRemove = () => {
    setFile(null);
    setFileName(null);
    setSheetData(null);

    fileRef.current.value = "";
  };

  const handleReadData = async () => {
    const sheetData = await loadFileData(file);

    if (sheetData) {
      setSheetData(sheetData);
      props.onFileUploaded(sheetData);
    }
  };

  return (
    <>
    {/* Title */}
      <Row>
        <Col>
          <h2>Excel Table</h2>
        </Col>
      </Row>

    {/* The labelk for displaying file name */}
      <Row>
        <Col>
          {fileName ? (
            <Label>{fileName}</Label>
          ) : (
            <Label>Please Upload a File</Label>
          )}
        </Col>
      </Row>

    {/* Place for uploading file(input) */}
      <Row>
        <Col>
          <input    
            type="file"
            accept="xlsx, xls, csv, json, xml"
            multiple={false}
            onChange={(e) => handleFile(e)}
            ref={fileRef}
          />

          {/* The 'remove file' button */}
          {fileName && (
            <i onClick={handleRemove} className="icon">
              <AiFillDelete />
            </i>
          )}

            {/* Read data button */}
          {file && (
                <div>
                  <Button onClick={handleReadData}  
                  color="primary">Read Excel Data</Button>
                </div>
          )}
        </Col>
      </Row>
    </>
  );
};
