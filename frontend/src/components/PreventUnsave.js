import React, { useEffect } from 'react';

export default function PreventUnsave(condition) {

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if(condition){}
          e.preventDefault();
          e.returnValue = '';   
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, [condition]);
    
      return null;

}