import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';

// Services
import {injector} from 'react-services-injector';
import services from './services';
import Header from "./components/Header";
import Main from "./components/Main";

injector.register(services);

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      title: ''
    };
  }

  componentWillMount() {
    this.setState({
      title: 'DVFGI'
    });
  }

  render() {
    return (
      <div className="App">
        <Header title={this.state.title}/>
        <Main/>
      </div>
    );
  }
}
