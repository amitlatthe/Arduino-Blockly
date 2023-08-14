import React, { useState } from 'react';
import './App.css';

function App() {
  const [sketchCode, setSketchCode] = useState('');
  const [hexCode, setHexCode] = useState('');

  const handleSketchChange = (event) => {
    setSketchCode(event.target.value);
  };

  const handleConvert = async () => {
    try {
      const formData = new FormData();
      formData.append('sketch', new Blob([sketchCode], { type: 'text/plain' }));

      const response = await fetch('http://localhost:8080/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const hexData = await response.text();
      setHexCode(hexData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h1>Arduino Sketch Converter</h1>
      <div>
        <textarea
          rows="10"
          cols="50"
          value={sketchCode}
          onChange={handleSketchChange}
          placeholder="Paste your Arduino sketch code here"
        />
      </div>
      <div>
        <button onClick={handleConvert}>Convert</button>
      </div>
      <div>
        <h2>Compiled Hex Code</h2>
        <pre>{hexCode}</pre>
      </div>
    </div>
  );
}

export default App;
