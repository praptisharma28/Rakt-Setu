import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './redux/store';

// Suppress noise from browser wallet extensions (Phantom, OKX, BitKeep, etc.)
// that inject into window.solana and throw unhandled rejections like
// `{code: 4001, message: "wallet must has at least one account"}` — these
// surface in webpack-dev-server's overlay as `[object Object]` and have
// nothing to do with this app.
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (e) => {
    const r = e.reason;
    const msg = (r && (r.message || r.toString && r.toString())) || '';
    const isWalletNoise =
      (r && (r.code === 4001 || r.code === -32603)) ||
      /wallet|solana|ethereum|metamask|phantom|okx/i.test(msg);
    if (isWalletNoise) e.preventDefault();
  });
  window.addEventListener('error', (e) => {
    const msg = (e && e.message) || '';
    if (/read only property 'solana'|read only property 'ethereum'/i.test(msg)) {
      e.preventDefault();
    }
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
