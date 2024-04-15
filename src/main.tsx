
import React from 'react';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';

//ReactDOM.createRoot(document.getElementById('root')).render(
createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);



/*
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { WrappApp } from './App';
import { HashRouter } from 'react-router-dom';
//import ReactDOM from 'react-dom';

import ReactDOM from 'react-dom/client';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <WrappApp />

  </React.StrictMode>
);

/*
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import App from './App';
import { HashRouter } from 'react-router-dom';
import  ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')).render(

    <React.StrictMode>
      <App />
    </React.StrictMode>

);

/*
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import App from './App';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <App />
    </React.StrictMode>

);
*/



/*import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom';
//import ReactDOM from 'react-dom';
//import { unstable_createRoot as createRoot } from 'react-dom';
//import ReactDOM from 'react-dom';
/*
import ReactDOM from 'react-dom/client';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    rootElement
  );
} else {
  throw new Error("Root element with ID 'root' not found.");
}
*/
/*
const rootElement = document.getElementById('root');
//const root = ReactDOM.createRoot(document.getElementById('root'));
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <Router>
    <React.StrictMode>
     
        <App />
   
    </React.StrictMode>
     </Router >
  );
} else {
  throw new Error("Root element with ID 'root' not found.");
}
*/
/*
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
)

*/