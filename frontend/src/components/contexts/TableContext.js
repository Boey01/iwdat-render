import React, { createContext, useState,useEffect } from 'react';

export const GlobalTableContext = createContext();

export default function GlobalTablesProvider({ children }) {
  const [globalTables, setGlobalTables] = useState([]);

  useEffect(() => {
  }, [globalTables]);

const addTablesToGlobalTableList = (tables) => {
    Object.keys(tables).forEach((key) => {
      globalTables.push({name: key, data: tables[key]});
    });

};

  
  return (
    <GlobalTableContext.Provider value={{ globalTables, setGlobalTables, addTablesToGlobalTableList}}>
      {/* <div className="table-workspace">
      {uploadedFiles.map((fileData, index) => (
        <div key={index}>
          <MakeDraggable>
            <TableRenderer sheetData={fileData} />
          </MakeDraggable>
        </div>
      ))}
      </div> */}
      {children}
    </GlobalTableContext.Provider>
  );
}