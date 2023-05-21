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
  try {
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data);
    const sheetNames = wb.SheetNames;
    const sheetData = {};

    sheetNames.forEach((sheet_name) => {
      const worksheet = wb.Sheets[sheet_name];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
      sheetData[sheet_name] = jsonData;
    });

    return sheetData;
  } catch (error) {
    // Handle any errors that occur during file reading
    console.error('Error reading XLSX file:', error);
    throw error; // Rethrow the error or handle it gracefully
  }
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

        const topLevelElement = Object.keys(result)[0];
        const tableName = Object.keys(result[topLevelElement])[0];
        let headers = Object.keys(result[topLevelElement][tableName][0]);
        let entries =  result[topLevelElement][tableName];

        if (headers.includes("$")) {
          const { modifiedHeaders, modifiedEntries } = removeAndReplaceKey(headers, entries);
          headers = modifiedHeaders;
          entries = modifiedEntries;
        }

        // Transforming the JSON data into the desired pattern
       
        console.log("headers", headers);
        console.log("entries",entries);

        const mergedData = { Data: [headers] };

        entries.forEach(item => {
        const values = headers.map(key => item[key] ? item[key][0] : "");
        mergedData.Data.push(values);
});

        resolve(mergedData);
      });
    };
    reader.onerror = (event) => {
      reject(event.target.error);
    };
    reader.readAsText(file);
  });
};

const removeAndReplaceKey = (headers, entries) => {
  let newHeader = "";
  const modifiedEntries = entries.map((obj) => {
    const modifiedObj = {};

    for (const key in obj) {
      if (key === "$") {
        const dollarSignProp = obj["$"];
        for (const innerKey in dollarSignProp) {
          modifiedObj[innerKey] = [dollarSignProp[innerKey]];
          newHeader = newHeader || innerKey;
        }
      } else {
        modifiedObj[key] = obj[key];
      }
    }

    return modifiedObj;
  });
  const modifiedHeaders = headers.map((key) => key.replace("$", newHeader))
  ;
  return { modifiedHeaders, modifiedEntries };
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
