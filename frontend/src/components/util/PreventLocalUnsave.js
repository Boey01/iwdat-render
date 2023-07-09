import React, { useEffect, useContext } from 'react';
import { GlobalTableContext } from '../contexts/TableContext';
import MiniDrawer from './SideBar';

export default function PreventUnsave({children}) {
 const {tableSaveState, saveTableListIntoLocal} = useContext(GlobalTableContext);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if(tableSaveState !== 0){
          e.preventDefault();
          e.returnValue = ''; 
            }  
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, [tableSaveState]);
      
      const triggerLocalSave = () =>{
        if(tableSaveState === 1){
        saveTableListIntoLocal();
        }
      }

      return (
      <>
      <MiniDrawer saveLocalFunction={triggerLocalSave}/>
      {children}
      </>
      );
}

export { PreventUnsave as SideBarWrap };