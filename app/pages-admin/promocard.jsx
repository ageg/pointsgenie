"use strict";
import React, { PropTypes } from "react";
import { Input, Button } from "react-bootstrap";

import request from "../middlewares/request";
import UserStore from "../stores/user";

const AdminPromocard = React.createClass({
  displayName: "AdminPromocard",

  contextTypes: {
    router: PropTypes.func
  },

  getInitialState() {
    return {};
  },

  onSubmit(e) {
    e.preventDefault();
    UserStore.assignPromocard(this.refs.cip.getValue(), (err, res) => {
      if (!err && res.status === 200) {
        this.context.router.transitionTo("/users");
      } else {
        const message = err ? err.message : res ? res.body : "Cip invalide";
        this.setState({
          isValid: false,
          message: message,
       });
      }
    });
  },

  onChange() {
    let state = {
      isValid: true,
    };
    state.cip = this.refs.cip.getValue();
    if (!state.cip.match(/^[a-zA-Z]{4}[0-9]{4}$/)) {
      state.isValid = false;
      state.message = "Le cip est invalide. Il doit être composé de 4 lettres suivi de 4 chiffres";
    }
    this.setState(state);
  },
  renderSubmitButton() {
    return (
      <Button type="submit" disabled={!this.state.isValid || this.props.isSubmitting} bsStyle="success">
        { this.props.isSubmitting ? "En cours...": "Attribuer la promocarte" }
      </Button>
    );
  },
  render() {
    const isValid = this.state.isValid;
    return (
      <div>
        <h3>Attribuer une promocarte</h3>
        <form className="form-horizontal" onSubmit={this.onSubmit}>
          <Input type="text" label="Cip" ref="cip" onChange={this.onChange} value={this.state.cip}
          labelClassName="col-md-3"  wrapperClassName="col-md-3" bsStyle={isValid ? null : "error" }
          help={isValid ? null : this.state.message } />
          {this.renderSubmitButton()}
        </form>
      </div>
    );
  }
});

export default AdminPromocard;