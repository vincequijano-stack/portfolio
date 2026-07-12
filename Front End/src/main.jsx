import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Import all existing CSS files in their original order
import '../assets/css/variables.css';
import '../assets/css/base.css';
import '../assets/css/animations.css';
import '../assets/css/components/header.css';
import '../assets/css/components/hero.css';
import '../assets/css/components/about.css';
import '../assets/css/components/projects.css';
import '../assets/css/components/services.css';
import '../assets/css/components/certificates.css';
import '../assets/css/components/contact.css';
import '../assets/css/components/footer.css';
import '../assets/css/components/testimonials.css';
import '../assets/css/components/speaking.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
