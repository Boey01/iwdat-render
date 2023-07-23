import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Provider} from 'react-redux';
import store from './redux/store';
import Initialization from "./components/util/AuthInitialization";
import { SideBarWrap } from "./components/util/PreventLocalUnsave";

import ZIndexProvider from './components/contexts/ZIndexContext';
import GlobalTablesProvider from './components/contexts/TableContext'
import  GlobalCardsProvider  from "./components/contexts/CardContext";

//--- below are pages ---------------------------------
import { Workspace } from "./components/pages/Workspace";
import Login  from "./components/pages/Login";
import { PageNotFound } from "./components/pages/PageNotFound";
import Signup  from "./components/pages/Signup";
import ActivateAccount  from "./components/pages/Activate";
import ResetPassReq from "./components/pages/ResetPassReq";
import ChangePassword from "./components/pages/ChangePass";
import { Dashboard } from "./components/pages/Dashboard";
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Montserrat',
      'sans-serif',
    ].join(','),
  },});

const ContextAndSidebarProvider = ({ children }) => {
  return (
    <GlobalTablesProvider>
      <GlobalCardsProvider>
      <ZIndexProvider>
        <SideBarWrap>{children}</SideBarWrap>
      </ZIndexProvider>
      </GlobalCardsProvider>
    </GlobalTablesProvider>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
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
    </ThemeProvider>
   </Provider>
  );
}
