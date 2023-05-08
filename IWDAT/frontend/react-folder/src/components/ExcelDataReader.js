import XLSX from "xlsx";

const acceptableFileName = ["xlsx","xls"];

const checkFileName = (name) => {
    return acceptableFileName.includes(name.split(".").pop().toLowerCase());
}

const readDataFromExcel = (data) => {
    const wb = XLSX.read(data); 
    const sheetNames = wb.SheetNames;
    var sheetData = {};

    for(var i = 0; i < sheetNames.length; i++){
        let sheet_name = sheetNames[i];

        const worksheet = wb.Sheets[sheet_name];
        const jsonData = XLSX.utils.sheet_to_json(worksheet,{
            blankrows: "",
            header: 1,
        });

        sheetData[sheet_name] = jsonData;
    }

    return sheetData;
}

const loadExcelData = async (file) => {
    if(!file) return null;

    if(!checkFileName(file.name)){
        alert("Invalid File Type");
        return null;
    }

    try {
        const data = await file.arrayBuffer();                    
        const sheetData = readDataFromExcel(data);

        return sheetData;

    } catch (error) {
        console.error(error);
        alert("Error reading file");
        return null;
    } 
}

export default loadExcelData;