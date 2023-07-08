import React from 'react';
import ZIndexProvider from '../contexts/ZIndexContext';
import TableManager from '../TableDataUtil/TableManager';
import GlobalTablesProvider from '../contexts/TableContext'
import {SideBarWrap} from '../util/PreventUnsave';

export const Workspace = () => {
  return (
    <GlobalTablesProvider>
    <ZIndexProvider>
      <SideBarWrap/>
      <TableManager/>
      <div className= "content">
        </div>
    </ZIndexProvider>
    </GlobalTablesProvider>
  );
};