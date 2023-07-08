import React, { createContext, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from "axios";
import { Snackbar } from '@mui/material';

export const GlobalTableContext = createContext();

export function GlobalTablesProvider({ children, isAuthenticated }) {
  const [globalTables, setGlobalTables] = useState([]);
  const [saveState, setSaveState] = useState(0); //0 = saved, 1= need save, 2= saving
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState(null);

  useEffect(() => {
    loadAccountTables();
    // const storedGlobalTables = localStorage.getItem('globalTables');

    // if (storedGlobalTables) {
    //   setGlobalTables(JSON.parse(storedGlobalTables));
    // }
  }, []);

  const handleSnackbarClose = () =>{
    setSnackbarOpen(false);
  };

  const addTablesToGlobalTableList = (tables) => {
    if (isAuthenticated) {
      Object.keys(tables).map((key) => {
        const name= key;
        const data = tables[key];
        const hidden= false
        const x = 0;
        const y =0;

         addNewTableToAccount(name,x, y, hidden,data );
  });
  //if not logged in, save locally
    }else{
      const updatedTables = Object.keys(tables).map((key) => ({
        table_id: null,
        table_name: key,
        data: tables[key],
        hidden: false,
        position_x: 0,
        position_y: 0
      }));

      setGlobalTables((prevTables) => [...prevTables, ...updatedTables]); 
      setSaveState(1);
    }
  };

  const deleteGlobalTable = (index) => {
  if(isAuthenticated){
    const targetTableID = globalTables[index]["table_id"];
     deleteTable(targetTableID, index);
  }else{
    deleteFromTableList (index);
  }
  };

  const deleteFromTableList = (index) =>{
    const updatedTables = [...globalTables];
    updatedTables.splice(index, 1);
    setGlobalTables(updatedTables);
    // setSaveState(1);
  }

  const toggleTableVisibility = (index) => {
    setGlobalTables((prevTables) => {
      const updatedTables = [...prevTables];
      updatedTables[index].hidden = !updatedTables[index].hidden;
      return updatedTables;
    });
    // setSaveState(1);
  };

  const updateTablePosition = (index, newPosition) => {
    setGlobalTables((prevTables) => {
      const updatedTables = [...prevTables];
      updatedTables[index].position = newPosition;
      return updatedTables;
    });
    // setSaveState(1);
  };

  const updateTableDataEdit = (index, newData) =>{
    setGlobalTables((prevTables) =>{
      const updatedTables = [...prevTables];
      updatedTables[index].data = newData;
      return updatedTables;
    });
    // setSaveState(1);
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
  
//--- BACKEND INVOVLED CRUD OPERATIONS ---------------------

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
          
        if(response.status===200){
          const createdDatabaseTable = response.data;
          setGlobalTables((prevTables) => [...prevTables, createdDatabaseTable]); 
          }
        }catch(err) {
          console.log(err);
        }
  }
  };


  const loadAccountTables = async () => {
    if (localStorage.getItem("access")) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("access")}`,
          Accept: "application/json",
        },
      };
  
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_API_URL}/tables/retrieve/`,
          config
        );

        setGlobalTables(response.data);
      } catch (err) {
        console.log(err);
      }
    }
  }

  const deleteTable = async (table_id, indexToDelete) => {
    if (localStorage.getItem("access")) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("access")}`,
        },
      };
  
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_BACKEND_API_URL}/tables/delete/${table_id}/`,
          config
        );
  
        if (response.status === 204) {
          setSnackbarMsg("Delete Succesful");
          setSnackbarOpen(true);
          
          deleteFromTableList (indexToDelete);
        }
      } catch (err) {
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        message={snackbarMsg}
      />
    </GlobalTableContext.Provider>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
});

export default connect(mapStateToProps, {})(GlobalTablesProvider);