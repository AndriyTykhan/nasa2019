import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import './index.css';
import App from './App';
import Map from './components/Map';

const routing = (
    <Router>
      <div>
        <Route path="/" component={App} />
        <Route path="/map" component={Map} />
      </div>
    </Router>
  )

ReactDOM.render(routing, document.getElementById('root'))
