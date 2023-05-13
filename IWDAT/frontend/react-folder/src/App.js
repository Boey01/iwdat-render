import React from "react";
// import { render } from "react-dom";
import ReactDOM from 'react-dom/client'
import { ExcelRender } from "./components/ExcelRenderer";


export default function App(){
    return (
     <ExcelRender/>
    );
}

const rootElement = document.getElementById('app')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) 