import React, { useState } from 'react';
import MiniDrawer from './SideBar';
import ZIndexProvider from './ZIndexContext';
import TableManager from './Tables/TableManager';

export const RendererMain = () => {
  const [sheetData, setSheetData] = useState(null);

  const handleFileUploaded = (e) => {
    console.log('File Uploaded', e);
    if (e) {
      setSheetData(e);
    }
  };

  return (
    <ZIndexProvider>
      <MiniDrawer />
      <TableManager/>
      <div class= "content">
          <div className="table-workspace">
          </div>
        </div>
    </ZIndexProvider>
  );
};