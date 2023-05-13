import React, { useState, useRef } from "react";
import { Row, Col, Label } from "reactstrap";
import loadFileData from "./ExcelDataReader";
import { AiFillDelete } from "react-icons/ai";

export const ExcelImport = (props) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [sheetData, setSheetData] = useState(null);

    const fileRef = useRef();

    const handleFile = (e) => {
        const myFile = e.target.files[0];
        if(!myFile) return;

        setFile(myFile);
        setFileName(myFile.name);
    }

    const handleRemove = () => {
        setFile(null);
        setFileName(null);
        setSheetData(null);

        fileRef.current.value = "";           
    }

    const handleReadData = async () => {
        const sheetData = await loadFileData(file);
      
        if(sheetData) {
          setSheetData(sheetData);
          props.onFileUploaded(sheetData);
        }
      }

    return (
        <><Row>
            <Col>
                <h2>Excel Table</h2>
            </Col>
        </Row>
        <Row>
                <Col>
                    <div className="file-upload-section">
                        {fileName ? <Label>{fileName}</Label> : <Label>Please Upload a File</Label>}
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <input
                        type="file"
                        accept="xlsx, xls"
                        multiple={false}
                        onChange={(e) => handleFile(e)}
                        ref={fileRef} />

                    {fileName && (
                        <i onClick={handleRemove} className="icon">
                            <AiFillDelete />
                        </i>
                    )}

                    {file && (
                        <div>
                            <button onClick={handleReadData}>Read Excel Data</button>
                        </div>
                    )}
                </Col>
            </Row>
            </>
    );
};