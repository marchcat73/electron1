import React, { useState } from 'react';
import Markdown from 'markdown-to-jsx';
import './App.css';

const { ipcRenderer } = window.require('electron');

const App = () => {
  const [loadedFile, setLoadedFile] = useState('');

  ipcRenderer.on('new-file', (event, fileContent) => {
    setLoadedFile(fileContent);
  });

  return (
    <div className="App">
      <Markdown>{loadedFile}</Markdown>
    </div>
  );
};

export default App;
