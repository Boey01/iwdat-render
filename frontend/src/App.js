import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Provider} from 'react-redux';
import store from './redux/store';
import Initialization from "./components/util/AuthInitialization";
import { SideBarWrap } from "./components/util/PreventLocalUnsave";

import ZIndexProvider from './components/contexts/ZIndexContext';
import GlobalTablesProvider from './components/contexts/TableContext'

//--- below are pages ---------------------------------
import { Workspace } from "./components/Pages/Workspace";
import Login  from "./components/Pages/Login";
import { PageNotFound } from "./components/Pages/PageNotFound";
import Signup  from "./components/Pages/Signup";
import ActivateAccount  from "./components/Pages/Activate";
import ResetPassReq from "./components/Pages/ResetPassReq";
import ChangePassword from "./components/Pages/ChangePass";
import { Dashboard } from "./components/Pages/Dashboard";

const ContextAndSidebarProvider = ({ children }) => {
  return (
    <GlobalTablesProvider>
      <ZIndexProvider>
        <SideBarWrap>{children}</SideBarWrap>
      </ZIndexProvider>
    </GlobalTablesProvider>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <Initialization>
    <Router>
        <Routes>        
        <Route
              path="/"
              element={
                <ContextAndSidebarProvider>
                  <Workspace />
                </ContextAndSidebarProvider>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ContextAndSidebarProvider>
                  <Dashboard />
                </ContextAndSidebarProvider>
              }
            />
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/activate/:uid/:token" element={<ActivateAccount />}/>
          <Route path="/request/reset" element={<ResetPassReq />}/>
          <Route path="/reset/password/:uid/:token" element={<ChangePassword/>}/>
          <Route path="*" element={<PageNotFound/>} />
        </Routes>
    </Router>
    </Initialization>
   </Provider>
  );
}
