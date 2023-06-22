import React from "react";

import {
  BrowserRouter as Router, Routes, Route
} from "react-router-dom";
import { RendererMain } from "./components/Workspace";
import {Login} from "./components/Auth/Login"
import { PageNotFound } from "./components/PageNotFound";
import { Signup } from "./components/Auth/Signup";
import { ActivateAccount } from "./components/Auth/Activate";
import { ResetPassReq } from "./components/Auth/ResetPassReq";
import { ChangePassword } from "./components/Auth/ChangePass";

export default function App(){
    return (
      <Router>
      <Routes>
        <Route path='/' element={<RendererMain/>}/>
        <Route path= '/login' element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/activate/:uid/:token" element={<ActivateAccount/>}/>
        <Route path="/request/reset" element={<ResetPassReq/>} />
        <Route path="/reset/password/:uid/:token" element={<ChangePassword/>} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
     </Router>
    );
}
