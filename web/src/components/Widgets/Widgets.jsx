import React from 'react';
import axios from 'axios';

import HelloWidget from './HelloWidget';

import GoogleCalendarWidget from './Google/GoogleCalendarWidget';
import GoogleRandomPhotoWidget from './Google/GoogleRandomPhotoWidget';
import GooglePhotosWidget from './Google/GooglePhotosWidget';

import SpotifyPlaylistsWidget from './Spotify/SpotifyPlaylistsWidget';
import SpotifyPlayerWidget from './Spotify/SpotifyPlayerWidget';
import SpotifyArtistsWidget from './Spotify/SpotifyArtistsWidget';

import '../../styles/Widgets/Widgets.css';
import {api_url, requestOptions} from '../../constants';

class Widgets extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      spotifyService: false,
      spotify_player: false,
      spotify_playlist: false,
      spotify_favorite: false,

      googleService: false,
      google_calendar: false,
      google_recent_photo: false,
      google_random_photo: false,
    };
  }

  async componentDidMount() {
    let result = await axios.get(`${api_url}/users/widgets`, requestOptions);
    for (let i = 0; i < result.data.widgets.length; i++) {
      const element = result.data.widgets[i];
      this.setState({[element.name]: element.active});
    }
  }

  render() {
  if (localStorage.getItem("loggedIn") === "true") {
    return(
      <div>
        <div className="line1">
          <HelloWidget/>
          {this.state.google_calendar ?
            <GoogleCalendarWidget/>
          :
            <div/>
          }
        </div>
        <div className="line2">
          {this.state.spotify_playlist ?
            <SpotifyPlaylistsWidget/>
          :
            <div/>
          }
          {this.state.spotify_player ?
            <SpotifyPlayerWidget/>
          :
            <div/>
          }
          {this.state.spotify_favorite ?
            <SpotifyArtistsWidget/>
          :
            <div/>
          }
        </div>
        <div className="line3">
            {this.state.google_random_photo ?
              <GooglePhotosWidget/>
            :
              <div/>
            }
            {this.state.google_recent_photos ?
              <GoogleRandomPhotoWidget/>
            :
              <div/>
            }
        </div>
      </div>
    );
  } else {
    window.location.href = "http://localhost:3000/login";
  }
  }
}

export default Widgets;
