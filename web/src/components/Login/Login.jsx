import React from "react";
import loginImg from "../../assets/login.svg";
import axios from 'axios';
import FbLogin from 'react-facebook-login';
import GooglegLogin from 'react-google-login';

import {api_url, requestOptions} from '../../constants';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    }

    this.handleChange = this.handleChange.bind(this);
    this.sendLoginInfos = this.sendLoginInfos.bind(this);
  }

  async sendLoginInfos() {
    await axios.post(`${api_url}/users/login`, {
      email: this.state.email,
      password: this.state.password,
    }, requestOptions)
    .then(function (response) {
      if (response.status === 200) {
        localStorage.setItem("loggedIn", true);
        window.location.href = "/";
      }
    })
    .catch(function (error) {
      console.error(error);
    });
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  async signupGoogle(res) {
        const googleresponse = {
          token: res
        };
        await axios.post(`${api_url}/users/login/google`, googleresponse, requestOptions)
        .then ((result) => {
          localStorage.setItem("loggedIn", true);
          window.location.href = "/";
        })
  }

  async signupFacebook(res) {
    const body = {
      username: res.name,
      token: res.accessToken
    };
    await axios.post(`${api_url}/users/login/facebook`, body, requestOptions)
    .then ((result) => {
      localStorage.setItem("loggedIn", true);
      window.location.href = "/";
    })
  }

  render() {
    const responseGoogle = (response) => {
      var res = response?.tokenId;
      this.signupGoogle(res);
    }
    const responseFacebook = (response) => {
      console.log(response)
      this.signupFacebook(response);
    }
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Login</div>
        <div className="content">
          <div className="image">
            <img src={loginImg} height={150} alt="LoginPicture"/>
          </div>
            <div className="form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" placeholder="email" value={this.state.email} onChange={this.handleChange}/>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.handleChange} />
              </div>
            </div>
          </div>
          <div className="footer">
            <br/>
            <button type="button" className="btn" onClick={() => this.sendLoginInfos()}>
              Login
            </button>
            <br/>
            <br/>
            <GooglegLogin
              clientId="9780007485-r78gt0747ojg4i8as47tf7h3kiqf4609.apps.googleusercontent.com"
              buttonText="Sign in"
              onSuccess={() => responseGoogle()}
              onFailure={() => responseGoogle()}
              isSignedIn/>
            <br/>
            <br/>
            <FbLogin
              appId="990427841364539"
              fields="name,email,picture"
              callback={(response) => responseFacebook(response)}
            />

          </div>
          <a href={'/signin'} style={{color: "white", fontSize: "14px"}}>Pas de compte ? Cliquez ici pour en créer un !</a>
      </div>
    );
  }
}

export default Login;
