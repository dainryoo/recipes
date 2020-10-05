import React from 'react';
import './App.css';

import Header from "./components/Header.js";
import Content from "./components/Content.js";

const App = () => {
  return (
    <div className="App">
      <Header/>
      <Content/>
    </div>
  );
}

export default App;
