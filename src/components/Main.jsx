import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

// Components
import HomeComponent from './home/HomeComponent';
import LoginComponent from './login/LoginComponent';
import SingleExportComponent from './exports/SingleExportComponent';
import MultipleExportComponent from './exports/MultipleExportComponent';

// Material

export default class Main extends Component {


  render() {
    return (
      <div className="main">
        <Route exact path="/" component={HomeComponent}/>
        <Route path="/login" component={LoginComponent}/>
        <Route path="/export/single" component={SingleExportComponent}/>
        <Route path="/export/multiple" component={MultipleExportComponent}/>
      </div>
    );
  }
}
