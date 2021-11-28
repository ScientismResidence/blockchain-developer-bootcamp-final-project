import React from "react"
import ReactDom from "react-dom"
import { BrowserRouter } from "react-router-dom";

import App from "./app"
import "./style/app.css"

const Router = () => {
    return (
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    );
};

ReactDom.render(<Router/>, document.getElementById('app'))