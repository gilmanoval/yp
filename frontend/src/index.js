import React from 'react';
import ReactDOM from 'react-dom/client'; // Импортируем правильную версию ReactDOM для React 18
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Создаем корень
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
