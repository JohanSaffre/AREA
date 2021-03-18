import axios from 'axios';
import React from 'react';
import { api_url, requestOptions } from '../../../constants';
import { VscTriangleRight, VscTriangleLeft } from 'react-icons/vsc';
import { MdPhotoLibrary } from 'react-icons/md';

import '../../../styles/Widgets/Google/GooglePhotosWidget.css';

class GooglePhotosWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photos: [],
      currentIndex: 0
    };

    this.handleClickLeft = this.handleClickLeft.bind(this);
    this.handleClickRight = this.handleClickRight.bind(this);
  }

  componentDidMount() {
    this.getRecentPhotos();
  }

  async getRecentPhotos() {
    let result = await axios.get(`${api_url}/google/photos/recent`, requestOptions);

    this.setState({photos: result.data.photos});
  }

  handleClickLeft() {
    const newIndex = this.state.currentIndex === 0 ? this.state.currentIndex : this.state.currentIndex - 1;
    this.setState({currentIndex: newIndex});
  }

  handleClickRight() {
    const newIndex = this.state.currentIndex === 9 ? this.state.currentIndex : this.state.currentIndex + 1;
    this.setState({currentIndex: newIndex});
  }

  render() {
    return (
      <div className="photosWidget">
        <div className="topsidePhotos">
          <p>Photos récentes</p>
          <MdPhotoLibrary className="googleIcon"/>
        </div>
        <div className="downsidePhotos">
          <VscTriangleLeft onClick={() => this.handleClickLeft()} style={{cursor: "pointer", color: "#6D6D6D"}} className="googlePhotoLeftArrow"/>
          <img src={this.state.photos[this.state.currentIndex]?.baseUrl} alt="" className="googlePhotosPicture"/>
          <VscTriangleRight onClick={() => this.handleClickRight()} style={{cursor: "pointer", color: "#6D6D6D"}} className="googlePhotoRightArrow"/>
        </div>
      </div>
    );
  }
}

export default GooglePhotosWidget;
