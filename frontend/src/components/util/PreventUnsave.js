import React, { useEffect, useContext } from 'react';
import { GlobalTableContext } from '../contexts/TableContext';
import MiniDrawer from '../SideBar';

export default function PreventUnsave() {
 const {saveState, saveTableListIntoLocal} = useContext(GlobalTableContext);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if(saveState !== 0){
              triggerSave();
          e.preventDefault();
          e.returnValue = ''; 
            }  
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, [saveState]);

      const triggerSave = () =>{
        if(saveState === 1){
        saveTableListIntoLocal();
        }
      }

      return <MiniDrawer saveFunction={triggerSave}/>;
}

export { PreventUnsave as SideBarWrap };