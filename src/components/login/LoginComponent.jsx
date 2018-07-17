import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

// Material
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default class LoginComponent extends Component {
  render() {
    return (
      <div className="login-component">
        <Grid container>
          <Grid item xs={12}>
            <Paper className="paper paper-login">
              <Typography variant="title" color="inherit">
                Anmeldung
              </Typography>
              <TextField
                required
                fullWidth={true}
                id="username"
                label="Benutzername"
                margin="normal"
              />
              <TextField
                required
                fullWidth={true}
                id="password"
                label="Passwort"
                type="password"
                margin="normal"
              />
              <div className="login-button">
                <Button
                  color="primary"
                  size="medium"
                  variant="raised"
                  type="submit"
                >
                  Abschicken
                </Button>
                <br/>
                <Link to="/">Passwort vergessen?</Link>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}
