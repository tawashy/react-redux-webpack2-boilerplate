import App from 'views/App';
import Dashboard from 'views/Dashboard';
import About from 'views/About';
import NotFound from 'views/NotFound';

export const publicPath = '/';

export const routeCodes = {
  DASHBOARD: publicPath,
  ABOUT: `${ publicPath }about`,
};

const routes = {
  path: publicPath,
  component: App,
  indexRoute: {
    component: Dashboard,
  },
  childRoutes: [
    {
      path: routeCodes.ABOUT,
      component: About,
    },
    {
      path: '*',
      component: NotFound,
    },
  ],
};

export default routes;
