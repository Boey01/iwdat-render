import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { connect } from 'react-redux';
import axios from "axios";
import { Snackbar } from '@mui/material';
import { debounce } from 'lodash';
import Modal from "@mui/material/Modal";
import DIModalContent from '../TableDataUtil/DataImportModal';

export const GlobalTableContext = createContext();

export function GlobalTablesProvider({ children, isAuthenticated }) {
  const [globalTables, setGlobalTables] = useState([]);
  const [tableSaveState, setTableSaveState] = useState(0); //0 = saved, 1= need save, 2= saving
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState(null);
  const [movedTables, setMovedTables] = useState({});
  const [hiddenTables, setHiddenTables] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [previousLocalData, setPreviousLocalData] = useState({});

  const hiddenTablesRef = useRef(hiddenTables);
  const movedTablesRef = useRef(movedTables);

  let positionChangeTimer;
  let hiddenChangeTimer;

  const updateTablesVisibilityDebounce = useCallback(
    debounce(() => {
      updateTablesVisibility(hiddenTablesRef.current);
    }, 3000),
    [updateTablesVisibility]  
  );

  const updateTablesPositionDebounce = useCallback(
    debounce(() => {
      updateTablesPosition(movedTablesRef.current);
    }, 3000),
    [updateTablesPosition]
  );

  useEffect(() => {
    if(isAuthenticated){ loadAccountTables();}
    
    let localTableList = localStorage.getItem('globalTables')
    if (localTableList) {
      localTableList = JSON.parse(localTableList);
      if(isAuthenticated){ 
        localTableList.forEach((table) => {
          const { table_name, data } = table;
          previousLocalData[table_name] = data;
        });
        setOpenModal(true);
    }else{
      setGlobalTables(localTableList);
    }
  }
    return () => {
      updateTablesVisibilityDebounce.cancel();
      updateTablesPositionDebounce.cancel();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    hiddenTablesRef.current = hiddenTables;
  }, [hiddenTables]);

  useEffect(() => {
    movedTablesRef.current = movedTables;
  }, [movedTables]);

  const handleSnackbarClose = () =>{
    setSnackbarOpen(false);
  };

  const handleCloseModal = () =>{
    setOpenModal(false);
  }

  // Add tables ----------------------------------------------------\
  const addTablesToGlobalTableList = (tables) => {
    if (isAuthenticated) {
      Object.keys(tables).forEach((key) => {
        const name = key;
        const data = tables[key];
        const hidden = false;
        const x = 0;
        const y = 0;
    
        addNewTableToAccount(name, x, y, hidden, data);
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
      setTableSaveState(1);
    }
  };

   // -------------------------------------------------------------/

  // Delete tables -----------------------------------------------\
  const deleteGlobalTable = (index) => {
  if(isAuthenticated){
    const targetTableID = globalTables[index].table_id;
     deleteTable(targetTableID, index);
  }else{
    deleteFromTableListUseState (index);
    setTableSaveState(1);
  }
  };

  const deleteFromTableListUseState = (index) =>{
    const updatedTables = [...globalTables];

    delete hiddenTables[updatedTables[index].table_id];
    delete movedTables[updatedTables[index].table_id];

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

      updateTablesVisibilityDebounce();

    }else{
      setTableSaveState(1);
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
      
      updateTablesPositionDebounce();

    }else{
      setTableSaveState(1);
    }
  };

  const updateTableDataEdit = (index, newData) =>{
    if(isAuthenticated){
      const edited_table = {[globalTables[index].table_id]:newData}
      updateTableData(edited_table);
    }else{
      setTableSaveState(1);
    }

    setGlobalTables((prevTables) =>{
      const updatedTables = [...prevTables];
      updatedTables[index].data = newData;
      return updatedTables;
    });
  } 

  const saveTableListIntoLocal = async () => {
    if (tableSaveState === 1) {
      setTableSaveState(2); // Set tableSaveState to 2 to indicate saving
      await new Promise((resolve) => {
        localStorage.setItem('globalTables', JSON.stringify(globalTables));
        resolve();
      });
      setTableSaveState(0); // Set tableSaveState to 0 to indicate saved
    }
  };
  
//--- BACKEND INVOVLED CRUD OPERATIONS ---------------------
async function addNewTableToAccount(table_name, position_x, position_y, hidden, data) {
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
          setGlobalTables((prevTables) => {
            return [...prevTables, createdDatabaseTable];
          });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }
}

async function loadAccountTables() {
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

async function deleteTable(table_id, indexToDelete) {
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

async function updateTablesVisibility(refHiddenTable) {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };

    const body = JSON.stringify(refHiddenTable);

    axios
      .put(
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
}

async function updateTablesPosition(refMovedTable) {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };

    const body = JSON.stringify(refMovedTable);

    axios
      .put(
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
}

async function updateTableData(target_table){
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };

    const body = JSON.stringify(target_table);

    axios
      .put(
        `${process.env.REACT_APP_BACKEND_API_URL}/tables/update/data/`,
        body,
        config
      )
      .then(function (response) {
      })
      .catch(function (err) {
        console.log(err);
      });
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
        tableSaveState,
        saveTableListIntoLocal,
        updateTableDataEdit,
        updateTableData,
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

      <Modal open={openModal} onClose={handleCloseModal}>
        <DIModalContent
          upload = {false}
          uploadedFile={previousLocalData}
          handleCloseModal={handleCloseModal}
          addTablesToGlobalTableList={addTablesToGlobalTableList}
        />
      </Modal>
    </GlobalTableContext.Provider>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
});

export default connect(mapStateToProps, {})(GlobalTablesProvider);