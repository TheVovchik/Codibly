/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import 'bulma/css/bulma.min.css';
import './index.scss';
import { HashRouter } from 'react-router-dom';
import { store } from './store/store';
import { App } from './components/App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
);
