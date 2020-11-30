import React, { useState, useEffect} from 'react';

const Directions = ({directions}) => {

  // clipboard obj holds all direction text to copy when user presses Copy to Clipboard button
  const [clipboard, setClipboard] = useState("");

  // reset the clipboard data if the recipe (i.e. directions) changes
  useEffect(() => {
    let clipboardText = "";
    directions.forEach((step) => {
      clipboardText += step + "\n";
    });
    setClipboard(clipboardText);
  }, [directions]);

  const copyToClipboard = (event) => {
    const clipboardData = document.getElementById("clipboard-data-directions");
    clipboardData.select();
    document.execCommand("copy");
  }

  return (
    <div className="subcontent">
      <div className="subheading">Directions:
        <button onClick={copyToClipboard}>Copy</button>
        <textarea readOnly id="clipboard-data-directions" value={clipboard}/>
      </div>
      <ul>
        {directions && directions.map((step, index) => (
          <li key={index}>
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Directions;
