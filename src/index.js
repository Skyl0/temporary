import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Router
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

ReactDOM.render(
  <Router>
    <div><App /></div>
  </Router>, document.getElementById('root'));
registerServiceWorker();
