import React from 'react';
import ZIndexProvider from './contexts/ZIndexContext';
import TableManager from './DataImporting/TableManager';
import GlobalTablesProvider from './contexts/TableContext'
import {SideBarWrap} from './util/PreventUnsave';

export const RendererMain = () => {
  return (
    <GlobalTablesProvider>
    <ZIndexProvider>
      <SideBarWrap/>
      <TableManager/>
      <div class= "content">
        </div>
    </ZIndexProvider>
    </GlobalTablesProvider>
  );
};