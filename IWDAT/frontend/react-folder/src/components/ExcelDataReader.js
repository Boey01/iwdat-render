import XLSX from "xlsx";
import Papa from "papaparse";
import xml2js from 'xml2js';


const checkFileName = (name) => {
  const fileExtension = name.split(".").pop().toLowerCase();

  switch (fileExtension) {
    case "xlsx":
    case "xls":
      return readXLSXData;
    case "csv":
      return readCSVData;
    case "json":
      return readJSONData;
    case "xml": 
      return readXMLData;
    default:
      return null;
  }
};

const readXLSXData = async (file) => {
  const data = await file.arrayBuffer();
  const wb = XLSX.read(data);
  const sheetNames = wb.SheetNames;
  var sheetData = {};

  for (var i = 0; i < sheetNames.length; i++) {
    let sheet_name = sheetNames[i];

    const worksheet = wb.Sheets[sheet_name];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      blankrows: "",
      header: 1,
    });

    sheetData[sheet_name] = jsonData;
  }

  return sheetData;
};

const readCSVData = (file) => {
    return new Promise((resolve, reject) => {
        var jsonData = {};
      Papa.parse(file, {
        complete: function(results) {
         jsonData["Data"] = results.data;
          resolve(jsonData);
        },
        error: function(error) {
          reject(error);
        }
      });
    });
  };

const readJSONData = (data) => {
  // Logic to read JSON file format
  // Modify this function according to the JSON file reading logic
  // Example:
  // const jsonData = parseJSON(data);
  // const sheetData = extractDataFromJSON(jsonData);
  // return sheetData;
  return null;
};

const readXMLData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const xmlString = event.target.result;
      xml2js.parseString(xmlString, (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }
        console.log(result);

        const arrayName = Object.keys(result)[0];

        const headers = Object.keys(result[arrayName][0]);

        // Transforming the JSON data into the desired pattern
        const transformedData = {};
        transformedData["Data"] = [headers].concat(
          result[arrayName].map((arrayName) => Object.values(arrayName))
        );

        resolve(transformedData);
      });
    };
    reader.onerror = (event) => {
      reject(event.target.error);
    };
    reader.readAsText(file);
  });
};

const loadFileData = (file) => {
  if (!file) return null;

  const fileTypeChecker = checkFileName(file.name);
  if (!fileTypeChecker) {
    alert("Invalid File Type");
    return null;
  }

  try {

    const sheetData = fileTypeChecker(file);

    return sheetData;
  } catch (error) {
    console.error(error);
    alert("Error reading file");
    return null;
  }
};

export default loadFileData;
