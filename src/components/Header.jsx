import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

// Material
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

export default class Header extends Component {

  render() {
    return (
      <div className="Header">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit">
              {this.props.title}
            </Typography>
            <Link to="/login">Login Page</Link>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
