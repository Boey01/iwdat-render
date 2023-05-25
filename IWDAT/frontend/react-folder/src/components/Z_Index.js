import React, { createContext, useContext, useState } from 'react';

const ZIndexContext = createContext();

const ZIndexProvider = ({ children }) => {
  const [highestZIndex, setHighestZIndex] = useState(0);

  const updateHighestZIndex = () => {
    setHighestZIndex((prevZIndex) => prevZIndex + 1);
  };

  const resetZIndex = () => {
    setHighestZIndex(0);
  };

  const zIndexValue = { highestZIndex, updateHighestZIndex, resetZIndex };

  return (
    <ZIndexContext.Provider value={zIndexValue}>
      {children}
    </ZIndexContext.Provider>
  );
};

export const useZIndex = () => useContext(ZIndexContext);

export default ZIndexProvider;