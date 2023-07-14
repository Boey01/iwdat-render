import XLSX from "xlsx";
import Papa from "papaparse";
import xml2js from 'xml2js';


const checkFileName = (name) => {
  const fileExtension = name.split(".").pop().toLowerCase();

  switch (fileExtension) {
    case "xlsx":
    case "xls":
    case "xlsm":
    case "csv":
      return readXLSXData;
    case "json":
      return readJSONData;
    case "xml": 
      return readXMLData;
    default:
      return null;
  }
};

const readXLSXData = (file) => {
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
        // Handle any errors that occur during file reading
        console.error('Error reading XLSX file:', error);
        reject(error); // Reject the promise with the error
      });
  });
};

// const readCSVData = (file) => {
//     return new Promise((resolve, reject) => {
//         var jsonData = {};
//       Papa.parse(file, {
//         header: true,
//         complete: function(results) {
//          jsonData["Data"] = results.data;
//           resolve(jsonData);
//         },
//         error: function(error) {
//           reject(error);
//         }
//       });
//     });
//   };

const readJSONData = (data) => {
  return new Promise((resolve, reject) => {
  var reader = new FileReader();
  reader.onload = (event) => {
    try{
      const parsedResult = JSON.parse(event.target.result);
      let jsonData = {};
      jsonData["data"] = parsedResult;

      resolve(jsonData);
    }catch(err){
      console.log(err);
    }
  }
  reader.readAsText(data);

  })
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
        console.log(jsonData)

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
  return {modifiedEntries };
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
