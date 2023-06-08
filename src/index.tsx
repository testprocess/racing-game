import React from 'react';
import ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import App from './App';
import World from './screen/index'


const rootElement = document.getElementById("app");
const root = ReactDOMClient.createRoot(rootElement);
root.render(
    <App />       
);

new World()