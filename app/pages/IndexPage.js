import React, { PropTypes } from "react";

import PointsLog from "../components/PointsLog";
import ApplyToEvent from "../components/ApplyToEvent";
import NextSchedule from "../components/NextSchedule";

import { RouteHandler, Link } from "react-router/build/npm/lib";
import { Table, Glyphicon } from "react-bootstrap";
import { sortByOrder as _sortByOrder } from "lodash"
import request from "../middlewares/request";

import connectToStore from "flummox/connect";

import EventStore from "../stores/event.js"

const IndexPage = React.createClass({
  displayName: "IndexPage",

  contextTypes: {
    flux: PropTypes.object,
  },

  getInitialState() {
    return {
      events: EventStore.getEvents(),
    }
  },

  componentWillMount() {
    EventStore.init();
  },

  componentDidMount() {
    EventStore.addChangeListener(this.updateEvents);
  },

  componentWillUnmount() {
    EventStore.removeChangeListener(this.updateEvents);
  },

  updateEvents() {
    if(!this.isMounted()) {
      return;
    }
    this.setState({
      events: EventStore.getEvents(),
    });
  },

  getNextEvent(EventSource) {
    let events = [];
    EventSource.forEach(function(entry) {
      if ( entry.startDate > Date.now() && entry.isClosed == true ) {
        events.push(entry)
        };
      });
    return events
  },

  getNextOpenEvent(EventSource) {
    let events = [];
    EventSource.forEach(function(entry) {
      if ( entry.startDate > Date.now() && entry.isClosed == false ) {
        events.push(entry)
        };
      });
    return events
  },

  render() {
    let nextEvents = this.getNextEvent(this.state.events);
    let nextOpenEvents = this.getNextOpenEvent(this.state.events);
    const user = this.props.user || {};
    if (nextEvents.length == 1) {
      return (
        <div className= "index-page" id="index-page">
          <ApplyToEvent authorization={user.authorization} manageEvent={this.state.events}  />
          <NextSchedule event={nextEvents[0]} />
          <PointsLog log={user.points} />
       </div>
      );
    } else {
      return (
        <div className= "index-page" id="index-page">
          <ApplyToEvent authorization={user.authorization} manageEvent={this.state.events} />
          <PointsLog log={user.points} />
        </div>
      );
    }
  }
});

const ConnectedEventList = connectToStore(IndexPage, {
  auth: store => ({
    user: store.getAuthenticatedUser(),
  })
});

export default ConnectedEventList;
