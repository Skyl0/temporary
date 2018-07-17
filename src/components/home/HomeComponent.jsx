import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

export default class HomeComponent extends Component {
  render() {
    return (
      <div className="home-component">
        <Link className="export-single" to='/export/single'>Single Export</Link>
        <Link className="export-multiple" to='/export/multiple'>Multiple Export</Link>
      </div>
    );
  }
}
