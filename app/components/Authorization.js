import React, { PropTypes } from "react";
import { Input } from "react-bootstrap";

const Authorization = React.createClass({
  displayName: "Authorization",

  propTypes: {
    authorization: PropTypes.shape({
      date: PropTypes.instanceOf(Date)
    }),
  },

  renderInner: function () {
    var authMessage = "Non-autorisé";
    var authDate = "";
    if ("date" in this.props.authorization) {
      authMessage = "Autorisé";
      authDate = this.props.authorization.date.toLocaleDateString();
    }
    return (
      <form className="form-horizontal">
        <Input type="static" label="Statut" labelClassName="col-md-3"
          wrapperClassName="col-md-6" value={authMessage} />
        <Input type="static" label="Date" labelClassName="col-md-3"
          wrapperClassName="col-md-6" value={authDate} />
      </form>
    );
  },
  render: function() {
    return (
      <div className="user-authorization-info">
        <h4>Autorisation</h4>
        {this.renderInner()}
      </div>
    );
  },
});

export default Authorization;
