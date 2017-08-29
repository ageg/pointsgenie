import React, { PropTypes } from "react";

import connectToStore from "flummox/connect";

import ApplyToEventSelector from "./ApplyToEventSelector";
import Event from "../../models/Event";
import request from "../../middlewares/request";

import EventStore from "../../stores/event";

const ApplyToEvent = React.createClass({
  displayName: "ApplyToEvent",

  contextTypes: {
    router: PropTypes.func,
    flux: PropTypes.object,
  },

  propTypes: {
    authorization: PropTypes.shape({
      date: PropTypes.instanceOf(Date),
    }),
  },

  getInitialState() {
    return { events: [], };
  },

  updateEventsStatus() {
    this.props.manageEvent.forEach(function(entry){
      if (entry.isClosedToPublic == true && Date.now() > entry.startApplication.getTime() && Date.now() < entry.endApplication.getTime()) {
        EventStore.openEvent(entry.id, (err, res) => {
          if (err) {
            console.log(err)
          }
        });
      } else if (entry.isClosedToPublic == false && Date.now() < entry.startApplication.getTime()) {
        EventStore.closeEvent(entry.id, (err, res) => {
          if (err) {
            console.log(err)
          }
        });
      } else if (entry.isClosedToPublic == false && Date.now() > entry.endApplication.getTime()) {
        EventStore.closeEvent(entry.id, (err, res) => {
          if (err) {
            console.log(err)
          }
        });
      }
    });
  },

  handleFormSubmit(e) {
    e.preventDefault();
    if (!this.refs.wrapper.isValid()) {
      return;
    }
    this.setState({ isSubmitting: true });
    const formData = this.refs.wrapper.getFormData();
    const url = "/application";
    request.post(url, formData, (err, res) => {
      let state = { isSubmitting: false };
      if (err) {
        state.alert = { style: "danger", message: `Erreur non-controlée: ${err.message}` };
      } else if (res.status === 200) {
        state.alert = { style: "success", message: `Postulation acceptée!` };
      } else {
        state.alert = { style: "danger", message: res.body.error };
      }
      this.setState(state, () => this.context.flux.getActions("event").fetchUpcomingEvents());
    });
  },

  handleAlertDismiss() {
    this.setState({ alert: undefined });
  },

  render() {
    this.updateEventsStatus();
    if (this.props.authorization && this.props.authorization.date) {
      return (
        <ApplyToEventSelector ref="wrapper" eventList={this.props.events} isFormSubmitting={this.state.isFormSubmitting}
          alert={this.state.alert} onAlertDismiss={this.handleAlertDismiss}
          onFormSubmit={this.handleFormSubmit}
        />
      );
    } else {
      return (
        <div className="apply-event">
          <h3>Postuler pour un événement</h3>
          <p>
	    Vous n'êtes pas autorisé à postuler
            Veuillez contacter votre association étudiante
          </p>
          {this.renderPossibleEventList()}
        </div>
      );
    }
  },

  renderPossibleEventList() {
    const eventList = this.props.events.map(event => (<li key={event.id}>{event.name}</li>));
    if (eventList.length > 0) {
      return (
        <div>
          <h4>Liste d'événements auxquels vous pourriez postuler</h4>
          <ul>
            {eventList}
          </ul>
        </div>
      );
    }
  }
});

const ConnectedApplyToEvent = connectToStore(ApplyToEvent, {
  event: store => ({
    events: store.getUpcomingEvents(),
  })
});

export default ConnectedApplyToEvent;
