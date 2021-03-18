import axios from 'axios';
import React from 'react';
import { api_url, requestOptions } from '../../../constants';

import { ImDice } from 'react-icons/im';
import { MdPhotoSizeSelectActual } from 'react-icons/md';

import '../../../styles/Widgets/Google/GoogleRandomPhotoWidget.css';

class GoogleRandomPhotoWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photo: ""
    };
  }

  componentDidMount() {
    this.getRandomPhoto();
  }

  async getRandomPhoto() {
    let result = await axios.get(`${api_url}/google/photos/random`, requestOptions);

    this.setState({photo: result.data.photos?.baseUrl});
  }

  handleClickRandom() {
    this.getRandomPhoto();
  }

  render() {
    return (
      <div className="randomPhotoWidget">
        <div className="topsideRandomPhoto">
          <p>Photo Aléatoire</p>
          <MdPhotoSizeSelectActual className="googleIcon"/>
        </div>
        <div className="downsideRandomPhoto">
          <img src={this.state.photo} alt="randomPhoto" className="googleRandomPhotoPicture"/>
          <ImDice className="randomizeButton" onClick={() => this.handleClickRandom()}/>
        </div>
      </div>
    );
  }
}

export default GoogleRandomPhotoWidget;
