import React, { createContext, useState, useEffect } from 'react';

export const GlobalTableContext = createContext();

export default function GlobalTablesProvider({ children }) {
  const [globalTables, setGlobalTables] = useState([]);

  useEffect(() => {
    console.log(globalTables);
  }, [globalTables]);

  const addTablesToGlobalTableList = (tables) => {
    const updatedTables = Object.keys(tables).map((key) => ({
      name: key,
      data: tables[key],
      hidden: false,
      position: { x: 0, y: 0 }, // Initialize the position property with default values
    }));

    setGlobalTables((prevTables) => [...prevTables, ...updatedTables]);
  };

  const deleteGlobalTable = (index) => {
    const updatedTables = [...globalTables];
    updatedTables.splice(index, 1);
    setGlobalTables(updatedTables);
  };

  const toggleTableVisibility = (index) => {
    setGlobalTables((prevTables) => {
      const updatedTables = [...prevTables];
      updatedTables[index].hidden = !updatedTables[index].hidden;
      return updatedTables;
    });
  };

  const updateTablePosition = (index, newPosition) => {
    setGlobalTables((prevTables) => {
      const updatedTables = [...prevTables];
      updatedTables[index].position = newPosition;
      return updatedTables;
    });
  };

  return (
    <GlobalTableContext.Provider
      value={{
        globalTables,
        setGlobalTables,
        addTablesToGlobalTableList,
        deleteGlobalTable,
        toggleTableVisibility,
        updateTablePosition,
      }}
    >
      {children}
    </GlobalTableContext.Provider>
  );
}
