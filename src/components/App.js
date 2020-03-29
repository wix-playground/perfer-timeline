import React from "react";
import "../styles.css";

import Timelines from "./Timelines";
import InputForm from "./InputForm";

export default function App() {
  return (
    <div className="App">
      <h1>Thunderbolt App Timeline </h1>
      <InputForm />
      <Timelines />
    </div>
  );
}
