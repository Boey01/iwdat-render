import React, { createContext, useState,useEffect } from 'react';

export const GlobalTableContext = createContext();

export default function GlobalTablesProvider({ children }) {
  const [globalTables, setGlobalTables] = useState([]);

  useEffect(() => {
  }, [globalTables]);

  const addTablesToGlobalTableList = (tables) => {
    const updatedTables = Object.keys(tables).map((key) => ({
      name: key,
      data: tables[key],
    }));
  
    setGlobalTables((prevTables) => [...prevTables, ...updatedTables]);
  };

  const deleteGlobalTable = (index) => {
    const updatedTables = [...globalTables];
    updatedTables.splice(index, 1);
    setGlobalTables(updatedTables);
  };
  
  return (
    <GlobalTableContext.Provider value={{ globalTables, setGlobalTables, addTablesToGlobalTableList, deleteGlobalTable}}>
      {children}
    </GlobalTableContext.Provider>
  );
}