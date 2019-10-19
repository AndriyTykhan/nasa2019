import React, { Component } from "react";
import GoogleSuggest from "./Search";

import "./style.css";

export default class Home extends React.Component {
    
  render() {
    return (
      <div className="home">
        <h1 className="home-title">
          World best tool <br />
          To see real air problems
        </h1>
        <div className="search-container">
          <GoogleSuggest />
        </div>
      </div>
    );
  }
}
