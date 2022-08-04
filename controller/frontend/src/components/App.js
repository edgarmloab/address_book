import React, { Component} from "react";
import { createRoot } from "react-dom/client";
import AddressBook from "./Book";
import "./data_table.css";



export default function App(props){
    const getData = row => {
    console.log(row, "rows data");
  };
    return(
        <AddressBook></AddressBook>);
    }
const appDiv = document.getElementById("app");
const root = createRoot(appDiv)
root.render(<App tab="Address Book" />);