import React from 'react';
import './App.css';

import Header from "./components/Header.js";
import Sidebar from "./components/Sidebar.js";
import Content from "./components/Content.js";

const App = () => {
  return (
    <div className="App">
      <Header/>
      <div className="app-body">
        <Sidebar/>
        <Content/>
      </div>
    </div>
  );
}

export default App;
