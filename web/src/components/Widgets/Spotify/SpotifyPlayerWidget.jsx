import React from 'react';
import axios from 'axios';

import '../../../styles/Widgets/Spotify/SpotifyPlayerWidget.css';
import {api_url, requestOptions} from '../../../constants';

import { IoMdSkipForward, IoMdSkipBackward, IoMdPlay, IoMdPause } from "react-icons/io";
import { GrSpotify } from "react-icons/gr";

class SpotifyPlayerWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      artists: [],
      cover: "",
      play: false,
    };

    this.handleClickPrev = this.handleClickPrev.bind(this);
    this.handleClickPlay = this.handleClickPlay.bind(this);
    this.handleClickPause = this.handleClickPause.bind(this);
    this.handleClickNext = this.handleClickNext.bind(this);

    this.getCurrentSong = this.getCurrentSong.bind(this);
    this.renderConcatedSongName = this.renderConcatedSongName.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleUpdate() {
    this.getPlayingState();
    if (this.state.play !== "noPlay") {
      this.getCurrentSong();
    }
  }

  componentDidMount() {
    this.getCurrentSong();
    this.interval = setInterval(() => this.handleUpdate(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async getPlayingState() {
    let result = await axios.get(`${api_url}/spotify/playing`, requestOptions);
    this.setState({play: result.data.is_playing});
    if (this.state.play !== true && this.state.play !== false) {
      this.setState({play: "noPlay"});
    }
  }

  async getCurrentSong() {
    let result = await axios.get(`${api_url}/spotify/current/`, requestOptions);
    var artists = [];
    if (result.data.current) {
      for (let i = 0; i < result.data.current.artists.length; i++) {
        const element = result.data.current.artists[i].name;
        artists.push(element);
      }
      this.setState({
        title: result.data.current.name,
        cover: result.data.current.album.images[2]?.url,
        artists: artists
      });
    }
  }

  renderConcatedSongName() {
    let ret = "";
    ret += this.state.title;
    if (ret.length > 25) {
      ret = ret.slice(0, 24);
      ret = ret.concat("...");
    }
    return (<p>{ret}</p>);
  }

  concatArtistsNames() {
    let ret = "";
    ret += this.state.artists[0];
    if (this.state.artists[1]) {
      ret += ", ";
      ret += this.state.artists[1];
      if (this.state.artists[2]);
        ret += ", ...";
    }
    return (<p>{ret}</p>);
  }

  async handleClickPrev() {
    await axios.get(`${api_url}/spotify/prev`, requestOptions);
  }

  async handleClickPlay() {
    await axios.get(`${api_url}/spotify/play`, requestOptions);
  }

  async handleClickPause() {
    await axios.get(`${api_url}/spotify/pause`, requestOptions);
  }

  async handleClickNext() {
    await axios.get(`${api_url}/spotify/next/`, requestOptions);
  }

  render() {
    return(
      <div className="playerWidget">
          {this.state.play === "noPlay"
          ?
            <div className="topSidePlayer" style={{marginTop: "25px"}}>
              Pas de son en cours
              <GrSpotify className="spotifyIcon"/>
            </div>
          :
            <div className="topsidePlayer">
              <img alt="logo" src={this.state.cover} height={64}/>
              <div className="songInfos">
                {this.renderConcatedSongName()}
                {this.concatArtistsNames()}
              </div>
              <GrSpotify className="spotifyIcon"/>
            </div>
          }
        <div className="downsidePlayer">
          <div className="icons">
            <IoMdSkipBackward onClick={() => this.handleClickPrev()} style={{cursor:"pointer"}}/>
            {this.state.play === false ?
              <IoMdPlay onClick={() => this.handleClickPlay()} style={{cursor:"pointer"}}/>
            :
              <IoMdPause onClick={() => this.handleClickPause()} style={{cursor:"pointer"}}/>
            }
            <IoMdSkipForward onClick={() => this.handleClickNext()} style={{cursor:"pointer"}}/>
          </div>
        </div>
      </div>
    );
  }
}

export default SpotifyPlayerWidget;

