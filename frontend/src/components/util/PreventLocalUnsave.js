import React, { useEffect, useContext } from 'react';
import { GlobalTableContext } from '../contexts/TableContext';
import MiniDrawer from './SideBar';

export default function PreventUnsave({children}) {
 const {saveState, saveTableListIntoLocal} = useContext(GlobalTableContext);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if(saveState !== 0){
          e.preventDefault();
          e.returnValue = ''; 
            }  
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, [saveState]);
      
      const triggerLocalSave = () =>{
        if(saveState === 1){
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