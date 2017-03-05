import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { Router, browserHistory } from 'react-router';
import thunk from 'redux-thunk';
import transit from 'transit-immutable-js';
import 'babel-polyfill';

import rootReducer from 'reducers';
import routes from 'routes';
import logger from 'dev/logger';

// Load SCSS
import '../scss/app.scss';

const isProduction = process.env.NODE_ENV === 'production';
const initalState = window.INITIAL_STATE ? transit.fromJSON(window.INITIAL_STATE) : null;

// Creating store
let store = null;

if (isProduction) {
  // In production adding only thunk middleware
  const middleware = applyMiddleware(thunk);

  if (initalState) {
    store = createStore(
      rootReducer,
      initalState,
      middleware
    );
  } else {
    store = createStore(
      rootReducer,
      middleware
    );
  }
} else {
  // In development mode beside thunk
  // logger and DevTools are added
  const middleware = applyMiddleware(thunk, logger);
  let enhancer;

  // Enable DevTools if browser extension is installed
  if (window.__REDUX_DEVTOOLS_EXTENSION__) { // eslint-disable-line
    enhancer = compose(
      middleware,
      window.__REDUX_DEVTOOLS_EXTENSION__() // eslint-disable-line
    );
  } else {
    enhancer = compose(middleware);
  }

  if (initalState) {
    store = createStore(
      rootReducer,
      initalState,
      enhancer
    );
  } else {
    store = createStore(
      rootReducer,
      enhancer
    );
  }
}

// Render it to DOM
ReactDOM.render(
  <Provider store={ store }>
    <Router history={ browserHistory } routes={ routes } />
  </Provider>,
  document.getElementById('root')
);
