import express from 'express';
import React from 'react';

import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';

import getRoutes from 'routes/server';
import Html from 'server/Html';

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from 'reducers';

let HtmlContainer = Html;

/*
http://stackoverflow.com/questions/39082976/how-to-pass-the-build-hash-as-an-environment-variable-in-webpack

new webpack.ExtendedAPIPlugin()

Adds useful free vars to the bundle.
__webpack_hash__ The hash of the compilation available as free var.
*/

const app = express();
const hostname = 'localhost';
const port = 8080;

function getMarkup(store, renderProps) {
  // const uri = __PRODUCTION__ ? '' : 'http://localhost:8000';
  // const uri = '';

  const component = (
    <Provider store={ store }>
      <RouterContext { ...renderProps } />
    </Provider>
  );

  const state = store.getState();
  console.log(state);

  const html = renderToString(
    <HtmlContainer
      component={ component }
      // script={ `${ uri }/client/index.js` }
      state={ state }
    />
  );

  return `<!doctype html>\n${ html }`;
}

// Store
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);


app.use('/assets', express.static('build/assets'));
app.use('/client', express.static('build/client'));

app.use((req, res) => {
  // Creates empty store for each request
  const Routes = getRoutes(store);

  match({
    location: req.url,
    routes: Routes,
  }, (error, redirectionLocation, renderProps) => {
    if (error) {
      console.error('Router error:', error);

      res.status(500).send(error.message);
    } else if (redirectionLocation) {
      res.redirect(302, redirectionLocation.pathname + redirectionLocation.search);
    } else if (renderProps) {
      res.status(200).send(getMarkup(store, renderProps));
    } else {
      res.status(400).send('Not Found');
    }
  });
});

// SEE: http://stackoverflow.com/questions/12871565/how-to-create-pem-files-for-https-web-server/12907165#12907165
// HTTPS server, commented out for now
// https.createServer({
//   key: fs.readFileSync('conf/key.pem'),
//   cert: fs.readFileSync('conf/cert.pem')
// }, app)
// .listen(port, function (error) {
//   if (error) {
//     console.error(error);
//   } else {
//     console.info(`==> 🌎  Open up https://${hostname}:${port}/ in your browser.`);
//   }
// });

// Start listening
app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${ port }. Open up http://${ hostname }:${ port }/ in your browser.`);
  }
});

// Hot module replacement
if (module.hot) {
  console.info('==> 🚀  [HMR] Server is listening…');

  module.hot.accept('./server/Html', () => {
    console.info('==> 🚀  [HMR] Patching Html');

    HtmlContainer = require('./server/Html').default;
  });

  module.hot.accept('./routes/index', () => {
    console.info('==> 🚀  [HMR] Patching Route');

    Route = require('./routes/index').default;
  });
}
