import React, { createContext, useState } from 'react';

export const ZIndexContext = createContext();

export const ZIndexProvider = ({ children }) => {
  const [globalZIndex, setGlobalZIndex] = useState(0);

  const updateGlobalZIndex = () => {
    setGlobalZIndex((prevZIndex) => prevZIndex + 1);
  };

  return (
    <ZIndexContext.Provider value={{ globalZIndex, updateGlobalZIndex }}>
      {children}
    </ZIndexContext.Provider>
  );
};