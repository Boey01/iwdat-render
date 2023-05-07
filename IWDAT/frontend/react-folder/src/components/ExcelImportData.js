    import React, { useState, useRef } from "react";
    import { Row, Col, Label } from "reactstrap";
    import XLSX from "xlsx";

    export const ExcelImport = (props) => {
        const [file, setFile] = useState(null);
        const [fileName, setFileName] = useState(null);
        const [sheetNames, setsheetNames] = useState([]);
        const [sheetData, setsheetData] = useState({});

        const fileRef = useRef();
        
        const acceptableFileName = ["xlsx","xls"];

        //pop action will remove the last element, guaranteed getting extension format
        const checkFileName = (name) => {
            return acceptableFileName.includes(name.split(".").pop().toLowerCase());
        }

        const readDataFromExcel = (data) => {
            const wb = XLSX.read(data); 
            //SheetNames is from the object, sheetNames is the one for useState
            setsheetNames(wb.SheetNames) 

            var mySheetData = {};

            //Loop through sheets
            for(var i = 0; i< wb.SheetNames.length; i++){
                let sheet_name = wb.SheetNames[i];

                const worksheet = wb.Sheets[sheet_name];
                const jsonData = XLSX.utils.sheet_to_json(worksheet,{
                    blankrows: "",
                    header: 1,
                });

                mySheetData[sheet_name] = jsonData;

                console.log(sheet_name);
            }

            setsheetData(mySheetData);

            return mySheetData;
        }

        const handleFile = async (e) => {
            const myFile = e.target.files[0];
            if(!myFile) return;

            if(!checkFileName(myFile.name)){
                alert("Invalid File Type");
                return;
            }

            try {
                // Read \excel file data
                const data = await myFile.arrayBuffer();                    
                const mySheetData = readDataFromExcel(data);

            setFile(myFile);
            setFileName(myFile.name);
            props.onFileUploaded(mySheetData);

            } catch (error) {
                console.error(error);
                alert("Error reading file");
            }           
        }

        const handleRemove = () => {
            setFile(null);
            setFileName(null);
            setsheetNames([]);
            setsheetData(null);

            props.onFileUploaded(null);

            fileRef.current.value = "";           
        }

        return (
        <Row>
            <Col>
            <div className ="mb-2">

                {fileName && <Label>{fileName}</Label>}
                {!fileName && <Label>Please Upload a File</Label>}

            </div>

            <div classNName="">
                <input
                type="file"
                accept="xlsx, xls"
                multiple={false}
                onChange={(e) => handleFile(e)}
                ref={fileRef}
                />
                {fileName &&(
                    <i onClick ={handleRemove}>
                        <p>remove file</p>
                    </i>
                )}
            </div>
            </Col>
        </Row>
        );
    }

