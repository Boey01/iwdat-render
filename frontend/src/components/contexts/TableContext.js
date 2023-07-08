import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { connect } from 'react-redux';
import axios from "axios";
import { Snackbar } from '@mui/material';
import { debounce } from 'lodash';

export const GlobalTableContext = createContext();

export function GlobalTablesProvider({ children, isAuthenticated }) {
  const [globalTables, setGlobalTables] = useState([]);
  const [saveState, setSaveState] = useState(0); //0 = saved, 1= need save, 2= saving, 3= need save for visiblity and position(online)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState(null);
  const [movedTables, setMovedTables] = useState({});
  const [hiddenTables, setHiddenTables] = useState({});

  const hiddenTablesRef = useRef(hiddenTables);
  const movedTablesRef = useRef(movedTables);

  let positionChangeTimer;
  let hiddenChangeTimer;

  const updateTablesVisibilityDebounce = useCallback(
    debounce(() => {
      updateTablesVisibility(hiddenTablesRef.current);
    }, 3000),
    []
  );

  const updateTablesPositionDebounce = useCallback(
    debounce(() => {
      updateTablesPosition(movedTablesRef.current);
    }, 3000),
    []
  );

  useEffect(() => {
    loadAccountTables();
    if(!isAuthenticated){
    if (localStorage.getItem('globalTables')) {
      setGlobalTables(JSON.parse(localStorage.getItem('globalTables')));
    }}
    return () => {
      updateTablesVisibilityDebounce.cancel();
      updateTablesPositionDebounce.cancel();
    };
  }, []);

  useEffect(() => {
    hiddenTablesRef.current = hiddenTables;
  }, [hiddenTables]);

  useEffect(() => {
    movedTablesRef.current = movedTables;
  }, [movedTables]);

  const handleSnackbarClose = () =>{
    setSnackbarOpen(false);
  };

  // Add tables ----------------------------------------------------\
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

   // -------------------------------------------------------------/

  // Delete tables -----------------------------------------------\
  const deleteGlobalTable = (index) => {
  if(isAuthenticated){
    const targetTableID = globalTables[index]["table_id"];
     deleteTable(targetTableID, index);
  }else{
    deleteFromTableListUseState (index);
    setSaveState(1);
  }
  };

  const deleteFromTableListUseState = (index) =>{
    const updatedTables = [...globalTables];
    updatedTables.splice(index, 1);
    setGlobalTables(updatedTables);
  }
  // -------------------------------------------------------------/

    // Edit tables -----------------------------------------------\
  const toggleTableVisibility = (index) => {
    
    setGlobalTables((prevTables) => {
      const updatedTables = [...prevTables];
      updatedTables[index].hidden = !updatedTables[index].hidden;
      return updatedTables;
    });

    if (isAuthenticated) {
      clearTimeout(hiddenChangeTimer);

     
      hiddenTables[globalTables[index].table_id]= globalTables[index].hidden;
      
      hiddenChangeTimer = setTimeout(() => {
        updateTablesVisibilityDebounce();
      },3000);
    }else{
      setSaveState(1);
    }
  };
  

  const updateTablePosition = (index, x, y) => {
    setGlobalTables((prevTables) => {
      const updatedTables = [...prevTables];
      updatedTables[index].position_x = x;
      updatedTables[index].position_y = y;
      return updatedTables;
    });

    if (isAuthenticated) {
      clearTimeout(positionChangeTimer);

      movedTables[globalTables[index].table_id] = globalTables[index].position_x +","+ globalTables[index].position_y;
      
      positionChangeTimer = setTimeout(() => {
         updateTablesPositionDebounce();
      },100);
    }else{
      setSaveState(1);
    }
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
function addNewTableToAccount(table_name, position_x, position_y, hidden, data) {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };

    const body = JSON.stringify({ table_name, position_x, position_y, hidden, data });

    axios
      .post(`${process.env.REACT_APP_BACKEND_API_URL}/tables/create/`, body, config)
      .then(function (response) {
        if (response.status === 200) {
          const createdDatabaseTable = response.data;
          setGlobalTables(function (prevTables) {
            return [...prevTables, createdDatabaseTable];
          });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }
}

function loadAccountTables() {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };

    axios
      .get(`${process.env.REACT_APP_BACKEND_API_URL}/tables/retrieve/`, config)
      .then(function (response) {
        setGlobalTables(response.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }
}

function deleteTable(table_id, indexToDelete) {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };

    axios
      .delete(`${process.env.REACT_APP_BACKEND_API_URL}/tables/delete/${table_id}/`, config)
      .then(function (response) {
        if (response.status === 204) {
          setSnackbarMsg("Delete Successful");
          setSnackbarOpen(true);

          deleteFromTableListUseState(indexToDelete);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }
}

function updateTablesVisibility(refHiddenTable) {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };

    const body = JSON.stringify(refHiddenTable);

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_API_URL}/tables/update/visible/`,
        body,
        config
      )
      .then(function (response) {
        setHiddenTables({});
      })
      .catch(function (err) {
        console.log(err);
      });
  }
  console.log(refHiddenTable);
}

function updateTablesPosition(refMovedTable) {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };

    const body = JSON.stringify(refMovedTable);

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_API_URL}/tables/update/position/`,
        body,
        config
      )
      .then(function (response) {
        setMovedTables({});
      })
      .catch(function (err) {
        console.log(err);
      });
  }
  console.log(refMovedTable);
}

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