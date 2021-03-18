import axios from 'axios';
import React from 'react';
import { api_url, requestOptions } from '../../../constants';
import { VscTriangleRight, VscTriangleLeft } from 'react-icons/vsc';
import { SiGooglecalendar } from 'react-icons/si';

import '../../../styles/Widgets/Google/GoogleCalendarWidget.css';

class GoogleCalendarWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      index: 0,
      length: 0
    };

    this.getEvents = this.getEvents.bind(this);
    this.renderEventInfos = this.renderEventInfos.bind(this);
  }

  componentDidMount() {
    this.getEvents();
  }

  handleClickLeft() {
    const newIndex = this.state.index === 0 ? this.state.index : this.state.index - 1;
    this.setState({index: newIndex});
  }

  handleClickRight() {
    const newIndex = this.state.index === this.state.length - 1 ? this.state.index : this.state.index + 1;
    this.setState({index: newIndex});
  }

  async getEvents() {
    let result = await axios.get(`${api_url}/google/calendar/events`, requestOptions);

    this.setState({events: result.data.events, length: result.data.events.length});
  }

  renderEventInfos(index) {
    let startDate = new Date(this.state.events[index]?.start.dateTime);
    let endDate = new Date(this.state.events[index]?.end.dateTime);

    return(
      <div className="calendarInfos">
        <p className="calendarSummary">{this.state.events[index]?.summary}</p>
        <p className="calendarHour">{startDate.getDate()}/{startDate.getMonth() + 1}/{startDate.getFullYear()} | {startDate.getHours()}:{startDate.getMinutes() !== 0 ? startDate.getMinutes() : "00"} - {endDate.getHours()}:{endDate.getMinutes() !== 0 ? endDate.getMinutes() : "00"}</p>
      </div>
    );
  }

  render() {
    return(
      <div className="calendarWidget">
        <div className="calendarLeftBar">
          <SiGooglecalendar className="calendarGoogleIcon"/>
        </div>
        <div className="calendarLeftPart">
          <VscTriangleLeft style={{cursor: "pointer", color: "#6D6D6D"}} onClick={() => this.handleClickLeft()}/>
        </div>
        <div className="calendarMiddlePart">
          {this.renderEventInfos(this.state.index)}
        </div>
        <div className="calendarRightPart">
          <VscTriangleRight style={{cursor: "pointer", color: "#6D6D6D"}} onClick={() => this.handleClickRight()}/>
        </div>
      </div>
    );
  }
}

export default GoogleCalendarWidget;
