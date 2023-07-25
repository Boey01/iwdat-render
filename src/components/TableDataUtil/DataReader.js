import XLSX from "xlsx";
import xml2js from 'xml2js';
import { callAlert } from "../util/CustomAlert";

const checkFileName = (name) => {
  const fileExtension = name.split(".").pop().toLowerCase();

  switch (fileExtension) {
    case "xlsx":
    case "xls":
    case "xlsm":
    case "csv":
      return readExcelData;
    case "json":
      return readJSONData;
    case "xml": 
      return readXMLData;
    default:
      return null;
  }
};

const readExcelData = (file) => {
  return new Promise((resolve, reject) => {
    file.arrayBuffer()
      .then((data) => {
        const wb = XLSX.read(data);
        const sheetNames = wb.SheetNames;
        const sheetData = {};

        sheetNames.forEach((sheet_name) => {
          const worksheet = wb.Sheets[sheet_name];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          sheetData[sheet_name] = jsonData;
        });

        resolve(sheetData);
      })
      .catch((error) => {
        console.error('Error reading XLSX file:', error);
        reject(error); 
      });
  });
};

const readXLSXDataFromURL = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}`);
        }
        return response.arrayBuffer();
      })
      .then(data => {
        const wb = XLSX.read(data);
        const sheetNames = wb.SheetNames;
        const sheetData = {};

        sheetNames.forEach((sheet_name) => {
          const worksheet = wb.Sheets[sheet_name];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          sheetData[sheet_name] = jsonData;
        });

        resolve(sheetData);
      })
      .catch(error => {
        console.error('Error reading Excel file from URL:', error);
        callAlert("Failed to fetch data", "error"); // Show custom alert
        reject(error); // Reject the Promise with the actual error
      });
  });
};



const readJSONData = (data) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedResult = JSON.parse(event.target.result);
        let jsonData = {};
        jsonData["data"] = parsedResult;

        resolve(jsonData);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    };
    reader.readAsText(data);
  });
};

const readXMLData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const xmlString = event.target.result;
      xml2js.parseString(xmlString, { explicitArray: false }, (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }
        console.log(result);
        const topLevelElement = Object.keys(result)[0];
        const tableName = Object.keys(result[topLevelElement])[0];
        let headers = Object.keys(result[topLevelElement][tableName][0]);
        let entries =  result[topLevelElement][tableName];

        if (headers.includes("$")) {
          const { modifiedEntries } = removeAndReplaceKey(entries);
          entries = modifiedEntries;
        }

        // Transforming the JSON data into the desired pattern

        let jsonData = {};
        jsonData["Data"] = entries;
        console.log(jsonData);

        resolve(jsonData);
      });
    };
    reader.onerror = (event) => {
      reject(event.target.error);
    };
    reader.readAsText(file);
  });
};

const removeAndReplaceKey = (entries) => {
  const modifiedEntries = entries.map((obj) => {
    const modifiedObj = {};

    for (const key in obj) {
      if (key === "$") {
        const dollarSignProp = obj["$"];
        for (const innerKey in dollarSignProp) {
          modifiedObj[innerKey] = dollarSignProp[innerKey];
        }
      } else {
        modifiedObj[key] = obj[key];
      }
    }

    return modifiedObj;
  });
  return { modifiedEntries };
};

const loadFileData = (fileOrURL) => {
  if (!fileOrURL) return null;
  try {
    if (typeof fileOrURL === "string") {
      if (fileOrURL.startsWith("http")) {
        return readXLSXDataFromURL(fileOrURL);
      }
      callAlert("Something wrong in reading the URL :(", "info");
      return null;
    }

    const fileTypeChecker = checkFileName(fileOrURL.name);
    if (!fileTypeChecker) {
      callAlert("Invalid file Type!", "warning");
      return null;
    }

    const sheetData = fileTypeChecker(fileOrURL);
    return sheetData;
  } catch (error) {
    console.error(error);
    callAlert("Error reading data");
    return null;
  }
};

export default loadFileData;
