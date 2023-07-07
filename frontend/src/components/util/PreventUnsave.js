import React, { useEffect, useContext } from 'react';
import { GlobalTableContext } from '../contexts/TableContext';
import MiniDrawer from '../SideBar';

export default function PreventUnsave() {
 const {saveState, saveTableListIntoLocal, updateAccountTableList } = useContext(GlobalTableContext);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if(saveState !== 0){
          e.preventDefault();
          e.returnValue = ''; 
          triggerLocalSave();
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

      const triggerOnlineSave =() =>{
        if(saveState === 1){
          updateAccountTableList();
          }
      }

      return <MiniDrawer saveLocalFunction={triggerLocalSave} saveOnlineFunction={triggerOnlineSave}/>;
}

export { PreventUnsave as SideBarWrap };