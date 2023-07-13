import React, {useState, useEffect, createContext } from "react";

export const GlobalVisualContext = createContext();

export function GlobalVisualProvider({ children }) {
    const [globalVisual, setGlobalVisual] = useState([]);

    const addVisual = (config, index) =>{
        const newVisual = {
            visual_id: null,
            card_id: index,
            visualized: false,
            visual_config:null,
            chart_type: null,
            position_x: 0,
            position_y: 0,
            width: 300,
            height:300,
          };
    }

    return (
        <GlobalVisualContext.Provider 
          value={{
            globalVisual,

          }}
        >
          {children}

        </GlobalVisualContext.Provider>
      );   
}
