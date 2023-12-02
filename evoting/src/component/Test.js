// Test.js

import React, { useState } from "react";
import "../CSS/Test.css";

function Test() {
  const [selected, setSelected] = useState("Ballot");
  const menuItems = ["Ballot", "Candidate", "Result section"];

  const handleSectionClick = (section) => {
    setSelected(section);
  };

  const getContent = () => {
    switch (selected) {
      case "Ballot":
        return "Information about Ballot";
      case "Candidate":
        return "Information about Candidate";
      case "Result section":
        return "Information about Result section";
      default:
        return "";
    }
  };

  return (
    <div className="containerd">
      <div className="menu">
        {menuItems.map((item) => (
          <span
            key={item}
            className={`menuItem ${selected === item ? "active" : ""}`}
            onClick={() => handleSectionClick(item)}
          >
            {item}
          </span>
        ))}
      </div>
      <div className="content">
        <div className="info">{getContent()}</div>
      </div>
    </div>
  );
}

export default Test;
