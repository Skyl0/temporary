import React, {Component} from 'react';

// Components / Services
import {injector} from 'react-services-injector';
import services from './services';
import Header from "./components/Header";
import Main from "./components/Main";

// Theme
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

injector.register(services);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2196F3'
    }
  }
});

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
      <div className="app-root">
        <MuiThemeProvider theme={theme}>
          <Header title={this.state.title}/>
          <Main/>
        </MuiThemeProvider>
      </div>
    );
  }
}
