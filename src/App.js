import React from "react";

//npm install react-router-dom --save
import {
  BrowserRouter,
  Route,
  Link,
  Routes
} from "react-router-dom";
import Home from "./view/home/Home";
import Main from "./view/main/Main";



function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/main">Main</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/main" element={<Main />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;