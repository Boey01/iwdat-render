import React, { createContext, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from "axios";

export const GlobalTableContext = createContext();

export function GlobalTablesProvider({ children, isAuthenticated }) {
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
      databaseID: null,
      name: key,
      data: tables[key],
      hidden: false,
      position: { x: 0, y: 0 },
    }));

    if (isAuthenticated) {
      updatedTables.map((table) => {
        const { x: pos_x, y: pos_y } = table.position;

        addNewTableToAccount(updatedTables.name,pos_x, pos_y, updatedTables.hidden,updatedTables.data );

      });
    
      
    }

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

  const updateTableDataEdit = (index, newData) =>{
    setGlobalTables((prevTables) =>{
      const updatedTables = [...prevTables];
      updatedTables[index].data = newData;
      return updatedTables;
    });
    setSaveState(1);
  } 

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
  
  const addNewTableToAccount = async (table_name, position_x, position_y, hidden, data ) => {
    if (localStorage.getItem("access")) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("access")}`,
        },
      };
  
      const body = JSON.stringify({ table_name, position_x, position_y, hidden, data });
      
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_API_URL}/tables/create/`,
          body,
      config
        );
          console.log(response.data);
        }catch(err) {
          console.log(err);
        }
  }
};
  

  const updateAccountTableList = async () =>{
    if(isAuthenticated){
      console.log(globalTables);
    }
  }

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
        updateTableDataEdit,
        updateAccountTableList,
      }}
    >
      {children}
    </GlobalTableContext.Provider>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
});

export default connect(mapStateToProps, {})(GlobalTablesProvider);