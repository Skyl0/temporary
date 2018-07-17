import React, {Component} from 'react';
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";

import axios from 'axios';

export default class SingleExportComponent extends Component {

  constructor() {
    super();
    this.state = {
      url: '',
      queryParameter: {},
      items: []
    }
  }

  componentDidMount() {
    this.setState({
      url: 'https://jsonplaceholder.typicode.com/users/',
      queryParameter: {}
    })

  }

  getRequest(event) {

    axios.get(this.state.url, {params: this.state.queryParameter})
      .then((res) => {
        console.log(res.data);
        this.setState({
          items: res.data
        })
      })
      .catch((err) => console.log(err))
      .then(() => {
        // finally
        console.log('finished');
      });
  }

  render() {
    return (
      <div className="single-export-component">
        <Card raised={true}>
          <Button onClick={this.getRequest.bind(this)}>Get Request</Button>
        </Card>
      </div>
    );
  }
}
