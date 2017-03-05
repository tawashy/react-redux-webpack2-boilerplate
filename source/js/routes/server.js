import routes, { routeCodes } from 'routes';

import { testAsync, testAsyncSuccess, testAsyncError } from 'actions/app';
import api from 'api';

import es6Promise from 'es6-promise';
import 'isomorphic-fetch';

es6Promise.polyfill();

function onEnterHome(store, nextState, replace, next) {
  // store - redux store, with store.dispatch atcion
  // nextState
  // next() -
  api.testAsync()
    .then(data => {
      console.log('----------- then');
      const test = store.dispatch(testAsyncSuccess(data));
      next();
    })
    .catch(error => {
      console.log('----------- catch');
      store.dispatch(testAsyncError(error));
      next();
    });
}

export default function getRoutes(store) {
  const onEnterMapper = {
    [routeCodes.ABOUT]: () => console.log('-- about on enter'),
  };

  routes.onEnter = () => console.log('-- app on enter');

  routes.indexRoute.onEnter =
    (nextState, replace, next) => onEnterHome(store, nextState, replace, next);

  routes.childRoutes.forEach(route => {
    if (onEnterMapper[route.path]) {
      route.onEnter = onEnterMapper[route.path];
    }
  });

  return routes;
}
