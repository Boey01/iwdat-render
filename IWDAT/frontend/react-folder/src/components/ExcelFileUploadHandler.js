import React, { useState, useRef } from "react";
import { Row, Col, Label } from "reactstrap";
import loadExcelData from "./ExcelDataReader";
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
        const sheetData = await loadExcelData(file);
      
        if(sheetData) {
          setSheetData(sheetData);
          props.onFileUploaded(sheetData);
        }
      }

    return (
        <Row>
            <Col>
                <>
                    {fileName && <Label>{fileName}</Label>}
                    {!fileName && <Label>Please Upload a File</Label>}
                </>

                <>
                    <input
                        type="file"
                        accept="xlsx, xls"
                        multiple={false}
                        onChange={(e) => handleFile(e)}
                        ref={fileRef}
                    />

                    {fileName && (
                        <i onClick={handleRemove} class="icon">
                            <AiFillDelete/>
                        </i>
                    )}
                </>

                {file && (
                    <div>
                        <button onClick={handleReadData}>Read Excel Data</button>
                    </div>
                )}
            </Col>
        </Row>
    );
};