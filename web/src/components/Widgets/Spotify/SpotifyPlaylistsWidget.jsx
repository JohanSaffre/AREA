import React from 'react';

import '../../../styles/Widgets/Spotify/SpotifyPlaylistsWidget.css';
import { GrSpotify } from "react-icons/gr";
import axios from 'axios';
import { api_url, requestOptions } from '../../../constants';

class SpotifyPlaylistsWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listes: [],
      get: false
    };

    this.renderPlaylists = this.renderPlaylists.bind(this);
    this.renderPlaylistsPictures = this.renderPlaylistsPictures.bind(this);

    this.getFavorites = this.getFavorites.bind(this);
  }

  componentDidMount() {
    this.getFavorites();
  }

  async getFavorites() {
    let result = await axios.get(`${api_url}/spotify/playlists`, requestOptions);

    for (let i = 0; i < result.data.playlists.length; i++) {
      const element = result.data.playlists[i];
      this.state.listes.push({"name": element.name, "image": element.images[0].url, "id": element.id});
    }
    this.setState({get: true});
  }

  async play(id) {
    await axios.get(`${api_url}/spotify/playlists/play/${id}`, requestOptions);
  }

  renderPlaylists() {
    return (
      this.state.listes.map((list, index) => {
        if (list.name.length > 10) {
          list.name = list.name.slice(0, 7);
          list.name = list.name.concat("...");
        }
        return (
          <p className="onePlaylistName" key={index}>{list.name}</p>
        );
      })
    );
  }

  renderPlaylistsPictures() {
    return (
      this.state.listes.map((list, index) => {
        return (
          <div className="onePlaylistPic" key={index}>
            <img alt="logo" src={list.image} height={50} style={{borderRadius:"10px"}} onClick={() => this.play(list.id)} />
          </div>
        );
      })
    )
  }

  render() {
    return(
      <div className="playlistsWidget">
        <div className="topsideArtists">
          <p>Playlists Favorites</p>
          <GrSpotify className="spotifyIcon"/>
        </div>
        <div className="downsideArtists">
          <div className="playlistsPics">
            {this.renderPlaylistsPictures()}
          </div>
          <div className="playlistsNames">
            {this.renderPlaylists()}
          </div>
        </div>
      </div>
    );
  }
}

export default SpotifyPlaylistsWidget;
