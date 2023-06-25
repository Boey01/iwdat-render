import React, { createContext, useState } from 'react';

export const GlobalTableContext = createContext();

export default function ZIndexProvider ({ children }) {
  let [globalTables, setGlobalTables] = useState({});

  return (
    <GlobalTableContext.Provider>
      {children}
    </GlobalTableContext.Provider>
  );
};