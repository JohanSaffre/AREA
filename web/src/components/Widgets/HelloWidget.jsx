import axios from 'axios';
import React from 'react';
import { api_url, months, requestOptions } from '../../constants';
import helloPicture from '../../assets/helloPicture.png';

import '../../styles/Widgets/HelloWidget.css';

class HelloWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
    };

    this.getUsername = this.getUsername.bind(this);
  }

  componentDidMount() {
    this.getUsername();
  }

  async getUsername() {
    let result = await axios.get(`${api_url}/users/username`, requestOptions);

    this.setState({username: result.data.username});
  }

  render() {
    const date = new Date();
    return(
      <div className="helloWidget">
        <div className="helloWidgetTexts">
          <div className="helloText">
              <p>Hello {this.state.username} !</p>
          </div>
          <div className="dateText">
            <p>Nous sommes le {date.getDate()} {months[date.getMonth()]} {date.getFullYear()}</p>
          </div>
        </div>
        <img src={helloPicture} alt="Hello"/>
      </div>
    );
  }
}

export default HelloWidget;
