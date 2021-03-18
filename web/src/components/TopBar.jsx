import React from 'react';

import '../styles/TopBar.css';
import {api_url, requestOptions, url} from '../constants';

import profile_pic from '../assets/profile_pic.png';
import {AiOutlinePlusCircle} from "react-icons/ai";
import {ImCross} from "react-icons/im";
import Switch from '@material-ui/core/Switch';
import axios from 'axios';
import { Menu, MenuItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';

import Modal from 'react-modal';

const modalStyles = document.documentElement.clientWidth < 1350 ?
  {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      height: '80%',
      width: '85%',
      borderRadius: '20px',
      background: '#161B46',
    }
  }
  :
  {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      height: '80%',
      width: '50%',
      borderRadius: '20px',
      background: '#161B46',
    }
  };

Modal.setAppElement('#root')

class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,

      spotifyService: false,
      spotify_player: false,
      spotify_playlist: false,
      spotify_favorite: false,

      googleService: false,
      google_calendar: false,
      google_random_photo: false,
      google_recent_photos: false,
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleSpotifyConnexion = this.handleSpotifyConnexion.bind(this);
    this.handleGoogleConnexion = this.handleGoogleConnexion.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handleClickAdd = this.handleClickAdd.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.sendWidgetsStatus = this.sendWidgetsStatus.bind(this);
  }

  async componentDidMount() {
    let result = await axios.get(`${api_url}/users/services`, requestOptions);

    this.setState({spotifyService: result.data.services[0].active, googleService: result.data.services[1].active});
    result = await axios.get(`${api_url}/users/widgets`, requestOptions);
    for (let i = 0; i < result.data.widgets.length; i++) {
      const element = result.data.widgets[i];
      this.setState({[element.name]: element.active});
    }
  }

  async handleLogout() {
    let result = await axios.post(`${api_url}/users/logout`, requestOptions);

    if(result.status === 200) {
      localStorage.setItem("loggedIn", false);
      window.location.reload();
    }
  }

  async sendWidgetsStatus() {
    const body = {
      widgets: [
        {name: "spotify_player", active: this.state.spotify_player},
        {name: "spotify_playlist", active: this.state.spotify_playlist},
        {name: "spotify_favorite", active: this.state.spotify_favorite},
        {name: "google_calendar", active: this.state.google_calendar},
        {name: "google_recent_photos", active: this.state.google_recent_photos},
        {name: "google_random_photo", active: this.state.google_random_photo},
      ]
    };
    let result = await axios.post(`${api_url}/users/widgets`, body, requestOptions);
    if (result.status === 200) {
      this.handleCloseModal();
      window.location.reload();
    }
  }

  handleClickAdd() {
    this.setState({modalIsOpen: true});
  }

  handleCloseModal() {
    this.setState({modalIsOpen: false});
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.checked});
  }

  handleSpotifyConnexion() {
    axios.get(`${api_url}/spotify/login`, requestOptions)
    .then(function (response) {
      if (response.status === 200) {
        window.open(response.data.url, "_blank") || window.location.replace(response.data.url);
        window.location.reload();
      }
    })
    .catch(function (error) {
      console.error(error);
    })
  }

  handleGoogleConnexion() {
    axios.get(`${api_url}/google/login`, requestOptions)
    .then(function (response) {
      if (response.status === 200) {
        window.open(response.data.url, "_blank") || window.location.replace(response.data.url);
      }
    })
    .catch(function (error) {
      console.error(error);
    })
  }

  async handleSpotifyDesactivate() {
    await axios.get(`${api_url}/spotify/logout`, requestOptions)
    .then((result) => {
      if (result.status === 200) {
        window.location.reload();
      }
    })
  }

  async handleGoogleDesactivate() {
    let result = await axios.get(`${api_url}/google/logout`, requestOptions);

    if (result.status === 200) {
      window.location.reload();
    }
  }

  render() {
    return(
      <div className="topBar">
        <div className="name">
          <h1 style={{cursor:"pointer"}} onClick={() => window.location.href = "/"}>Surface.</h1>
        </div>
        {window.location.href === `${url}/`
        ?
          <div className="addWidget">
            <p className="textClickHere">Cliquez ici pour ajouter un nouveau widget</p>
            <AiOutlinePlusCircle size={50} className="plusIcon" onClick={() => this.handleClickAdd()} style={{cursor:"pointer"}}/>
          </div>
        :
          <div/>
        }
        <div className="profilePicture">
          <Menu menuButton={<img alt="logo" src={profile_pic} height={75} style={{borderRadius:"50%", background: "black", cursor: "pointer"}}/>}>
            <MenuItem onClick={() => this.handleLogout()}>Logout</MenuItem>
          </Menu>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          style={modalStyles}
          contentLabel="Example Modal"
        >
          <ImCross onClick={() => this.handleCloseModal()} style={{cursor:"pointer", color: "white"}}/>
          <h2 style={{color: "white", textAlign:"center"}}>Ajouter un widget</h2>
          <div className="spotifySwitchContainer">
            <div className="spotifyTitle">
              <p style={{color: "white", textAlign: "center", textDecoration: "underline"}}>Spotify:</p>
              {this.state.spotifyService ? <button className="spotifyDesactivateButton" onClick={() => this.handleSpotifyDesactivate()}>Désactiver</button> : <div/>}
            </div>
            {
              this.state.spotifyService
              ?
              <div className="spotifySwitchOnly">
                <div className="oneSwitch">
                  Playlists favorites
                  <Switch
                    checked={this.state.spotify_playlist}
                    onChange={this.handleChange}
                    name="spotify_playlist"
                    />
                </div>
                <div className="oneSwitch">
                  Player
                  <Switch
                    checked={this.state.spotify_player}
                    onChange={this.handleChange}
                    name="spotify_player"
                    />
                </div>
                <div className="oneSwitch">
                  Musiques favorites
                  <Switch
                    checked={this.state.spotify_favorite}
                    onChange={this.handleChange}
                    name="spotify_favorite"
                    />
                </div>
              </div>
              :
              <button className="spotifyButton" onClick={() => this.handleSpotifyConnexion()}>Connexion</button>
            }
          </div>
          <div className="googleSwitchContainer">
            <div className="googleTitle">
              <p style={{color: "white", textAlign: "center", textDecoration: "underline"}}>Google:</p>
              {this.state.googleService ? <button className="googleDesactivateButton" onClick={() => this.handleGoogleDesactivate()}>Désactiver</button> : <div/>}
            </div>
            {
              this.state.googleService
              ?
              <div className="googleSwitchOnly">
                <div className="oneSwitch">
                  Calendrier
                  <Switch
                    checked={this.state.google_calendar}
                    onChange={this.handleChange}
                    name="google_calendar"
                    />
                </div>
                <div className="oneSwitch">
                  Photos récentes
                  <Switch
                    checked={this.state.google_recent_photos}
                    onChange={this.handleChange}
                    name="google_recent_photos"
                    />
                </div>
                <div className="oneSwitch">
                  Photo aléatoire
                  <Switch
                    checked={this.state.google_random_photo}
                    onChange={this.handleChange}
                    name="google_random_photo"
                    />
                </div>
              </div>
              :
              <button onClick={() => this.handleGoogleConnexion()}>Connexion</button>
            }
          </div>
          <div className="validateButtonContainer">
            <button onClick={() => this.sendWidgetsStatus()} className="validateButton" >Valider</button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default TopBar;
