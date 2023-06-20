import React from "react";
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router, Routes, Route
} from "react-router-dom";
import { RendererMain } from "./components/DataRenderMain";
import {Login} from "./components/Auth/LoginPage"
import { PageNotFound } from "./components/PageNotFound";

export default function App(){
    return (
      <Router>
      <Routes>
        <Route path='/' element={<RendererMain/>}/>
        <Route path= '/login' element={<Login/>}/>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
     </Router>
    );
}

const rootElement = document.getElementById('app')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) 