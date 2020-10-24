import React from "react";
import ReactDOM from "react-dom";
import { Game } from "./app/Game";
import "./index.scss";

ReactDOM.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>,
  document.getElementById("root")
);

console.log(process.env.NODE_ENV);
