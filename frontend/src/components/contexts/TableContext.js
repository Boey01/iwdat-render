import React, { createContext, useState, useEffect } from 'react';

export const GlobalTableContext = createContext();

export default function GlobalTablesProvider({ children }) {
  const [globalTables, setGlobalTables] = useState([]);
  const [saveState, setSaveState] = useState(0); //0 = saved, 1= need save, 2= saving

  useEffect(() => {
    const storedGlobalTables = localStorage.getItem('globalTables');

    if (storedGlobalTables) {
      setGlobalTables(JSON.parse(storedGlobalTables));
    }
  }, []);

  const addTablesToGlobalTableList = (tables) => {
    const updatedTables = Object.keys(tables).map((key) => ({
      name: key,
      data: tables[key],
      hidden: false,
      position: { x: 0, y: 0 },
    }));

    setGlobalTables((prevTables) => [...prevTables, ...updatedTables]); 
    setSaveState(1);
  };

  const deleteGlobalTable = (index) => {
    const updatedTables = [...globalTables];
    updatedTables.splice(index, 1);
    setGlobalTables(updatedTables);
    setSaveState(1);
  };

  const toggleTableVisibility = (index) => {
    setGlobalTables((prevTables) => {
      const updatedTables = [...prevTables];
      updatedTables[index].hidden = !updatedTables[index].hidden;
      return updatedTables;
    });
    setSaveState(1);
  };

  const updateTablePosition = (index, newPosition) => {
    setGlobalTables((prevTables) => {
      const updatedTables = [...prevTables];
      updatedTables[index].position = newPosition;
      return updatedTables;
    });
    setSaveState(1);
  };

  const saveTableListIntoLocal = async () => {
    if (saveState === 1) {
      setSaveState(2); // Set saveState to 2 to indicate saving
      await new Promise((resolve) => {
        localStorage.setItem('globalTables', JSON.stringify(globalTables));
        resolve();
      });
      setSaveState(0); // Set saveState to 0 to indicate saved
    }
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
        saveState,
        saveTableListIntoLocal,
      }}
    >
      {children}
    </GlobalTableContext.Provider>
  );
}
