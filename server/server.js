import path from 'path';
import fs from 'fs';
import express from 'express';
import React from 'react';
import ReactDOMServer, { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import {ServerStyleSheet, StyleSheetManager} from 'styled-components';
import App from '../src/containers/App';

const PORT = 8080;
const app = express();

app.get('/*', (req, res) => {
  const context = {};
  const sheet = new ServerStyleSheet();

  const app = ReactDOMServer.renderToString(
    <StyleSheetManager sheet={sheet.instance}>
      <Router location={req.url} context={context}>
        <App />
      </Router>
    </StyleSheetManager>
  );
  const styleTags = sheet.getStyleTags();
  sheet.seal();

  const indexFile = path.resolve('./build/index.html');
  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong: ', err);
      return res.status(500).send('Oops, something went wrong on our end!');
    }

    data = data.replace('<div id="root"></div>', `<div id="root">${app}</div>`);

    return res.send(data);
  });
});

app.listen(PORT, () => {
  console.log(`Server-Side Rendered application running on port ${PORT}`);
});