import React, { useState } from 'react';
import Markdown from 'markdown-to-jsx';
import AceEditor from 'react-ace';
import brace from 'brace';
import './App.css';

const { ipcRenderer } = window.require('electron');

const App = () => {
  const [loadedFile, setLoadedFile] = useState('');

  ipcRenderer.on('new-file', (event, fileContent) => {
    setLoadedFile(fileContent);
  });

  return (
    <div className="App">
      <AceEditor
        mode="markdown"
        theme="dracula"
        onChange={(newContent) => {
          setLoadedFile(newContent);
        }}
        name="markdown_editor"
        value={loadedFile}
      />
      <Markdown>{loadedFile}</Markdown>
    </div>
  );
};

export default App;
