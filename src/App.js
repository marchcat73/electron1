import React, { useState, useEffect, useCallback } from 'react';
import Markdown from 'markdown-to-jsx';
import AceEditor from 'react-ace';
import styled from 'styled-components';
import 'brace/mode/markdown';
import 'brace/theme/dracula';
import './App.css';

const settings = window.require('electron-settings');
const { ipcRenderer } = window.require('electron');
const fs = window.require('fs');

const App = () => {
  const [loadedFile, setLoadedFile] = useState('');
  const [directory, setDirectory] = useState(settings.get('directory') || null);
  const [filesData, setFilesData] = useState([]);

  // On Load

  ipcRenderer.on('new-file', (event, fileContent) => {
    setLoadedFile(fileContent);
  });

  ipcRenderer.on('new-dir', (event, dir) => {
    setDirectory(dir);
    settings.set('directory', dir);
    loadAndReadFiles(dir);
  });

  ipcRenderer.setMaxListeners(0);

  // const loadFile = (index) => {
  //   const content = fs.readFileSync(filesData[index].path).toString();
  //   setLoadedFile(content);
  // };

  const loadFile = useCallback(
    (index) => {
      const content = fs.readFileSync(filesData[index].path).toString();
      setLoadedFile(content);
    },
    [filesData]
  );

  const loadAndReadFiles = (directory) => {
    fs.readdir(directory, (err, files) => {
      const filtredFiles = files.filter((file) => file.includes('.md'));
      const filesData = filtredFiles.map((file) => ({
        path: `${directory}/${file}`,
      }));

      setFilesData(filesData);
      // loadFile(0);
    });
  };

  const directoryNew = settings.get('directory');

  if (directoryNew) {
    loadAndReadFiles(directoryNew);
  }

  useEffect(() => {
    if (filesData.length > 0) {
      console.log('render');
      loadFile(0);
    }
  }, [loadFile, filesData]);

  return (
    <AppWrap>
      <Header>Journal</Header>
      {directory ? (
        <Split>
          <FilesWindow>
            {filesData.map((file, index) => (
              <button onClick={() => loadFile(index)} key={index}>
                {file.path}
              </button>
            ))}
          </FilesWindow>
          <CodeWindow>
            <AceEditor
              mode="markdown"
              theme="dracula"
              onChange={(newContent) => {
                setLoadedFile(newContent);
              }}
              name="markdown_editor"
              value={loadedFile}
            />
          </CodeWindow>
          <RenderedWindow>
            <Markdown>{loadedFile}</Markdown>
          </RenderedWindow>
        </Split>
      ) : (
        <LoadingMessage>
          <h2>Press CmdORCtrl+K to open directory</h2>
        </LoadingMessage>
      )}
    </AppWrap>
  );
};

export default App;

const AppWrap = styled.div`
  margin-top: 23px;
`;

const Header = styled.header`
  background-color: #191324;
  color: #75717c;
  font-size: 0.8rem;
  height: 1.5rem;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.2);
  z-index: 10;
  -webkit-app-region: drag;
`;

const Split = styled.div`
  display: flex;
  height: 100vh;
`;

const FilesWindow = styled.div`
  background-color: #140f1d;
  border-right: solid 1px #302b3a;
  position: relative;
  width: 20%;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    box-shadow: -10px 0 20px rgba(0, 0, 0, 0.3) inset;
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: #191324;
  height: 100vh;
`;

const CodeWindow = styled.div`
  flex: 1;
  padding-top: 2rem;
  background-color: #191324;
`;

const RenderedWindow = styled.div`
  background-color: #191324;
  width: 35%;
  padding: 20px;
  color: #fff;
  border-left: 1px solid #302b3a;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #82d8d8;
  }
  h1 {
    border-bottom: solid 3px #e54b4b;
    padding-bottom: 10px;
  }
  a {
    color: #e54b4b;
  }
`;
