import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { FitnessProvider } from './context/FitnessContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FitnessProvider>
          <App />
        </FitnessProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
