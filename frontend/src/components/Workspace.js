import React from 'react';
import MiniDrawer from './SideBar';
import ZIndexProvider from './ZIndexContext';
import TableManager from './DataImporting/TableManager';
import GlobalTablesProvider from './contexts/TableContext'

export const RendererMain = () => {

  return (
    <GlobalTablesProvider>
    <ZIndexProvider>
      <MiniDrawer />
      <TableManager/>
      <div class= "content">
        </div>
    </ZIndexProvider>
    </GlobalTablesProvider>
  );
};