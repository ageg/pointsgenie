import React, { PropTypes } from "react";
import { Input } from "react-bootstrap";

const Promocard = React.createClass({
  displayName: "Promocard",

  propTypes: {
    promocard: PropTypes.shape({
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      date: PropTypes.instanceOf(Date)
    }),
  },

  renderInner: function () {
    var promocarteMessage = "Promocarte non-attribuée";
    var promocarteDate = "";
    if ("date" in this.props.promocard) {
      promocarteMessage = "Promocarte attribuée";
      promocarteDate = this.props.promocard.date.toLocaleDateString();
    }
    return (
      <form className="form-horizontal">
        <Input type="static" label="Statut" labelClassName="col-md-3"
          wrapperClassName="col-md-6" value={promocarteMessage} />
        <Input type="static" label="Date" labelClassName="col-md-3"
          wrapperClassName="col-md-6" value={promocarteDate} />
      </form>
    );
  },
  render: function() {
    return (
      <div className="user-promocard-info">
        <h4>Promocarte</h4>
        {this.renderInner()}
      </div>
    );
  },
});

export default Promocard;
