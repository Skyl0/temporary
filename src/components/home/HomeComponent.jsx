import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

export default class HomeComponent extends Component {
  render() {
    return (
      <div className="HomeComponent">
        <p>New Component HomeComponent</p>
        <Link to='/export/single'>Single Export</Link>
      </div>
    );
  }
}
