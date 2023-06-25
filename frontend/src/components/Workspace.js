import React from 'react';
import MiniDrawer from './SideBar';
import ZIndexProvider from './ZIndexContext';
import TableManager from './DataImporting/TableManager';

export const RendererMain = () => {

  return (
    <ZIndexProvider>
      <MiniDrawer />
      <TableManager/>
      <div class= "content">
        </div>
    </ZIndexProvider>
  );
};