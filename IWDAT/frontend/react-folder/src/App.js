import React from "react";
import { render } from "react-dom";
import { ExcelRender } from "./components/ExcelRenderer";

export default function App(){
    return (
                    <ExcelRender/>
    );
}

const appDiv = document.getElementById("app");
render(<App/>, appDiv);