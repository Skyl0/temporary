import React, {Component} from 'react';

// Material
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

export default class LoginComponent extends Component {
  render() {
    return (
      <div className="LoginComponent">
        <Grid container>
          <Grid item xs={12}>
            <Paper className="paper paper-login" square={true}>
              Content
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}
