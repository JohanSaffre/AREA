import axios from "axios";
import React from "react";
import loginImg from "../../assets/login.svg";

import {api_url, requestOptions} from '../../constants';

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      email: ""
    }

    this.handleChange = this.handleChange.bind(this);
    this.sendRegisterInfos = this.sendRegisterInfos.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  async sendRegisterInfos() {
    await axios.post(`${api_url}/users/signup`, {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    }, requestOptions)
    .then(function (response) {
      if (response.status === 200) {
        localStorage.setItem("loggedIn", true);
        window.location.href = "/";
      }
    })
    .catch(function(error) {
      console.error(error);
    });
  }

  render() {
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Register</div>
        <div className="content">
          <div className="image">
            <img src={loginImg} height={150} alt="signinPicture"/>
          </div>
            <div className="form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" placeholder="username" value={this.state.username} onChange={this.handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" placeholder="email" value={this.state.email} onChange={this.handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.handleChange} />
              </div>
            </div>
          </div>
          <div className="footer">
            <button type="button" className="btn" onClick={() => this.sendRegisterInfos()} >
              Register
            </button>
          </div>
      </div>
    )
  }
}

export default Register;
