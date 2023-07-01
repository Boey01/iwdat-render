import React from 'react';
import MiniDrawer from './SideBar';
import ZIndexProvider from './contexts/ZIndexContext';
import TableManager from './DataImporting/TableManager';
import GlobalTablesProvider from './contexts/TableContext'
import PreventUnsave from './PreventUnsave';

export const RendererMain = () => {
PreventUnsave(true);
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