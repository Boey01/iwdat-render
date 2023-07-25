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
import Dashboard from "./components/pages/Dashboard";
import { createTheme, ThemeProvider } from '@mui/material';
import { AlertProvider } from "./components/contexts/AlertContext";
import GlobalAlert from "./components/util/CustomAlert";
import { DialogProvider } from "./components/contexts/DialogContext";
import GlobalDialog from "./components/util/CustomDialog";

const createColor = (mainColor) => ({ main: mainColor });

const theme = createTheme({
  typography: {
    fontFamily: [
      'Montserrat',
      'sans-serif',
    ].join(','),
  },
  palette: {
    one: {main: "#6350f2",contrastText: '#ffffff'},
    two: {main: "#2124ee", contrastText: '#ffffff'},
    three: createColor("#efeff9"),
    four: createColor("#74708f"),
    five: createColor("#DFF250"),

  }
});

const ContextAndSidebarProvider = ({ children }) => {
  return (
    <AlertProvider>
      <DialogProvider>
    <GlobalTablesProvider>
      <GlobalCardsProvider>
      <ZIndexProvider>
        <SideBarWrap>{children}</SideBarWrap>
        <GlobalAlert/>
        <GlobalDialog/>
      </ZIndexProvider>
      </GlobalCardsProvider>
    </GlobalTablesProvider>
    </DialogProvider>
    </AlertProvider>
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
