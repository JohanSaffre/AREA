import React from 'react';

import '../../../styles/Widgets/Spotify/SpotifyArtistsWidget.css';
import { GrSpotify } from "react-icons/gr";
import axios from 'axios';
import { api_url, requestOptions } from '../../../constants';

class SpotifyArtistsWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      songs: [],
      covers: [],
    };

    this.renderArtists = this.renderArtists.bind(this);
    this.renderArtistsPictures = this.renderArtistsPictures.bind(this);

    this.getFavorites = this.getFavorites.bind(this);
  }

  async componentDidMount() {
    this.getFavorites();
  }

  async getFavorites() {
    let result = await axios.get(`${api_url}/spotify/favorites/tracks`, requestOptions)
    let songs = []
    let covers = []

    for (let i = 0; i < result.data.items.length; i++) {
      const element = result.data.items[i];
      songs.push(element.name)
      covers.push(element.album.images[2].url)
    }
    this.setState({songs: songs, covers: covers})
  }

  renderArtists() {
    return (
      this.state.songs.map((artist, index) => {
        if (artist.length > 10) {
          artist = artist.slice(0, 7)
          artist = artist.concat("...")
        }
        return (
          <p className="oneArtistName" key={index}>{artist}</p>
        )
      })
    )
  }

  renderArtistsPictures() {
    return (
      this.state.covers.map((picture, index) => {
        return (
          <div className="oneArtistPic" key={index}>
            <img alt="logo" src={picture} height={50} style={{borderRadius:"10px"}}/>
          </div>
        )
      })
    )
  }

  render() {
    return(
      <div className="artistsWidget">
        <div className="topsideArtists">
          <p>Musiques Favorites</p>
          <GrSpotify className="spotifyIcon"/>
        </div>
        <div className="downsideArtists">
          <div className="artistsPics">
            {this.renderArtistsPictures()}
          </div>
          <div className="artistsNames">
            {this.renderArtists()}
          </div>
        </div>
      </div>
    )
  }
}

export default SpotifyArtistsWidget;


