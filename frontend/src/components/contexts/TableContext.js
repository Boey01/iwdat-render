import React, { createContext, useState } from 'react';

export const GlobalTableContext = createContext();

export default function GlobalTablesProvider({ children }) {
  const [globalTables, setGlobalTables] = useState({});

  const addTablesToGlobalContext = (tables) => {
    setGlobalTables((prevGlobalTables) => ({
      ...prevGlobalTables,
      ...tables,
    }));
    console.log(globalTables);
  };

  return (
    <GlobalTableContext.Provider value={{ addTablesToGlobalContext }}>
      {children}
    </GlobalTableContext.Provider>
  );
}