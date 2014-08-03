/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Glyphicon = require("react-bootstrap/Glyphicon");
var Input = require("react-bootstrap/Input");

var SpinnerInput = require("./spinner-input");

module.exports = React.createClass({
  displayName: "TimePicker",
  propTypes: {
    onChange: PropTypes.func.isRequired,
    defaultTime: PropTypes.instanceOf(Date),
    minuteClickStep: PropTypes.number,
  },
  getDefaultProps: function () {
    return {
      minuteClickStep: 15,
    };
  },
  getInitialState: function () {
    var state = {};
    if (this.props.defaultTime) {
      state.hours = this.props.defaultTime.getHours() % 12;
      state.minutes = this.props.defaultTime.getMinutes();
      state.meridian = this.props.defaultTime.getHours() < 12 ? "AM" : "PM";
    } else {
      state.hours = 0;
      state.minutes = 0;
      state.meridian = "AM";
    }
    return state;
  },
  getValue: function () {
    return {
      hours: this.state.hours + (this.state.meridian === "PM" ? 12 : 0),
      minutes: this.state.minutes,
    };
  },
  handleHourUpClick: function () {
    this.setState({
      hours: (this.state.hours + 1) % 12
    }, this.props.onChange);
  },
  handleHourDownClick: function () {
    this.setState({
      hours: (this.state.hours + 11) % 12
    }, this.props.onChange);
  },
  handleHourChange: function () {
    var state = {};
    state.hours = Math.max(parseInt(this.refs.hours.getValue(), 10) || 0, 0);
    if (state.hours < 24 && state.hours > 12) {
      state.hours = state.hours % 12;
      state.meridian = "PM";
    }
    this.setState(state, this.props.onChange);
  },
  handleMinuteUpClick: function () {
    this.setState({
      minutes: (this.state.minutes + this.props.minuteClickStep) % 60,
    }, this.props.onChange);
  },
  handleMinuteDownClick: function () {
    this.setState({
      minutes: (this.state.minutes + (60 - this.props.minuteClickStep)) % 60,
    }, this.props.onChange);
  },
  handleMinuteChange: function () {
    var minutesStr = this.refs.minutes.getValue();
    var minutes = parseInt(minutesStr, 10) || 0;
    if (minutesStr.length > 2 && minutes > 99) {
      minutes = Math.floor(minutes / 10);
    }
    this.setState({
      minutes: Math.max(parseInt(minutes, 10) || 0, 0),
    }, this.props.onChange);
  },
  handleMeridianClick: function () {
    this.setState({
      meridian: this.refs.meridian.getValue() == "AM" ? "PM" : "AM",
    }, this.props.onChange);
  },
  handleMeridianChange: function () {
    this.setState({
      meridian: this.refs.meridian.getValue(),
    }, this.props.onChange);
  },
  getMeridianStyle: function () {
    return (this.state.meridian == "AM" || this.state.meridian == "PM") ? null : "error";
  },
  getHourStyle: function () {
    return (this.state.hours < 23) ? null : "error";
  },
  getMinuteStyle: function () {
    return (this.state.minutes < 60) ? null : "error";
  },
  getPaddedMinutes: function () {
    return (this.state.minutes < 10) ? "0" + this.state.minutes : this.state.minutes;
  },
  render: function () {
    return (
      <span>
        <SpinnerInput type="text" ref="hours" value={this.state.hours} maxLength={2}
          groupClassName="timepicker-hours" bsStyle={this.getHourStyle()}
          onUpClick={this.handleHourUpClick} onDownClick={this.handleHourDownClick} onChange={this.handleHourChange} />
        <SpinnerInput type="text" ref="minutes" value={this.getPaddedMinutes()} maxLength={3}
          groupClassName="timepicker-mins" bsStyle={this.getMinuteStyle()}
          onUpClick={this.handleMinuteUpClick} onDownClick={this.handleMinuteDownClick} onChange={this.handleMinuteChange} />
        <SpinnerInput type="text" ref="meridian" value={this.state.meridian} maxLength={2}
          groupClassName="timepicker-meridian" bsStyle={this.getMeridianStyle()}
          onUpClick={this.handleMeridianClick} onDownClick={this.handleMeridianClick} onChange={this.handleMeridianChange} />
      </span>
    );
  }
});
