import axios from 'axios';

export default class CustomerApi {

  constructor({url}) {
    this.url = url;
    this.resource = 'customer';
  }

  getAll({query}) {
    return axios.get(this.url + '/' + this.resource, {params: {query}});
  }

  getSingle(id) {
    return axios.get(this.url + '/' + this.resource + '/' + id);
  }

}
