import React, { useEffect, useContext } from 'react';
import { GlobalTableContext } from '../contexts/TableContext';
import MiniDrawer from './SideBar';
import { GlobalCardContext } from '../contexts/CardContext';

export default function PreventUnsave({children}) {
 const {tableSaveState, saveTableListIntoLocal } = useContext(GlobalTableContext);
 const {cardSaveState, saveCardListIntoLocal } = useContext(GlobalCardContext);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if(tableSaveState !== 0 || cardSaveState !==0){
          e.preventDefault();
          e.returnValue = ''; 
            }  
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, [tableSaveState]);

      const triggerLocalSave = (type) =>{
        if(type === 0){
        if(tableSaveState === 1){
        saveTableListIntoLocal();
        console.log("table");
        }
      }
      
      if(type === 1){
        if(cardSaveState === 1){
          saveCardListIntoLocal();
          console.log("card");
        }
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