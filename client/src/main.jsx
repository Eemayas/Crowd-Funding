import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { StateContextProvider } from "./context";
import App from "./App";
import "./index.css";
import MetaNotPresent from "./MetaNotPresent"
const root = ReactDOM.createRoot(document.getElementById("root"));

const AppsTry = () => {
  if (typeof window.ethereum !== "undefined") {
    return <App />
  } else {
    return <MetaNotPresent />;
  }
};
root.render(<AppsTry/>);
