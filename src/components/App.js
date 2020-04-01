import React from "react";
import "../styles.css";

import Timelines from "./Timelines";
import StatusBar from "./StatusBar";

export default function App() {
  return (
    <div className="App">
      <h1>Thunderbolt App Timeline </h1>
      <StatusBar />
      <Timelines />
    </div>
  );
}
