import React, { createContext, useState } from 'react';

export const ZIndexContext = createContext();

export default function ZIndexProvider ({ children }) {
  let [globalZIndex, setGlobalZIndex] = useState(0);

  const updateGlobalZIndex = () => {
    setGlobalZIndex((prevZIndex) => {
      const newIndex = prevZIndex + 1;
      return newIndex > 100 ? 0 : newIndex;
    });
  };

  return (
    <ZIndexContext.Provider value={{ globalZIndex, updateGlobalZIndex }}>
      {children}
    </ZIndexContext.Provider>
  );
};