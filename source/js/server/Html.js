import React, { PropTypes } from 'react';
import { renderToString } from 'react-dom/server';
import transit from 'transit-immutable-js';

import { publicPath } from 'routes';

export function Html(props) {
  const {
    component,
    script,
    state,
  } = props;

  const content = component ? renderToString(component) : '';
  // transit needs state to be a string to parse it back to immutable on a client
  const stateString = `window.INITIAL_STATE = '${ transit.toJSON(state) }';`;

  return (
    <html className='no-js' lang='en'>

      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='x-ua-compatible' content='ie=edge' />
        <title>App title</title>
        <meta name='description' content='App description' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0' />

        <link rel='apple-touch-icon' href='apple-touch-icon.png' />
        <link rel='icon' href='data:;base64,iVBORw0KGgo=' />

        <link href={ `${ publicPath }client/style.css` } rel='stylesheet' />
      </head>

      <body>
        <div
          id='root'
          dangerouslySetInnerHTML={ { __html: content } } // eslint-disable-line react/no-danger
        />
        <script
          dangerouslySetInnerHTML={ { __html: stateString } } // eslint-disable-line react/no-danger
        />
        <script src={ `${ publicPath }client/vendor.js` } />
        <script src={ `${ publicPath }client/client.js` } />
      </body>

    </html>
  );
}

Html.propTypes = {
  component: PropTypes.object,
  script: PropTypes.string,
  state: PropTypes.object,
};

export default Html;
