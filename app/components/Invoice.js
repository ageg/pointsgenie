import React, { PropTypes } from "react";
import { Input, Button, Alert, Pager } from "react-bootstrap";
import _ from "lodash";

import request from "../middlewares/request";

const Invoice = React.createClass({
  displayName: "Invoice",
  
    propTypes: {
      user: PropTypes.object,
    },
  
  getInitialState() {
    return {
      user: this.props.user
    };
  },

  renderFacture: function() {
    return(
      <div className="invoice__items">
        <div className="row invoice__spacer">
          <div className="col-sm-6 invoice__column-title">Articles</div>
          
          <div className="col-sm-6 invoice__column-title invoice__column-price">Prix</div>
        </div>

        <div className="row invoice__spacer">
          <div className="col-sm-6">Cérémonie de la remise du jonc</div>
          
          <div className="col-sm-6 invoice__column-price">{this.state.user.factureJonc} $</div>
        </div>

        <div className="row">
          <div className="col-sm-6">Voyage</div>
          
          <div className="col-sm-6 invoice__column-price">{this.state.user.factureVoyage} $</div>
        </div>

        <div className="row">
          <div className="col-sm-6">Bal</div>
          
          <div className="col-sm-6 invoice__column-price">{this.state.user.promInscription.cost} $</div>
        </div>

        <div className="row">
          <div className="col-sm-6">Album de finissants</div>
          
          <div className="col-sm-6 invoice__column-price">{this.state.user.factureAlbum} $</div>
        </div>

        <div className="row">
          <div className="col-sm-6">Photos de finissants</div>

          <div className="col-sm-6 invoice__column-price">{this.state.user.facturePhotos} $</div>
        </div>

        <div className="row">
          <div className="col-sm-6">Manteau</div>

          <div className="col-sm-6 invoice__column-price">{this.state.user.factureManteau} $</div>
        </div>

        <div className="row">
          <div className="col-sm-6">Déjà payé (photos)</div>
          
          <div className="col-sm-6 invoice__column-price">{this.state.user.paid ? this.state.user.paid.photo : 0} $</div>
        </div>

        <div className="row">
          <div className="col-sm-6">Déjà payé (voyage)</div>
          
          <div className="col-sm-6 invoice__column-price">{this.state.user.paid ? this.state.user.paid.voyage : 0} $</div>
        </div>
      </div>
    );
  },

  renderTotal() {
    const balance = this.state.user.invoiceBalance;
    return (
      <div>
        <div className="row">          
          <div className="col-sm-12 invoice__column-total">Sous-Total: {balance} $</div>
        </div>
      </div>
    );
  },

  render: function() {
    return (
      <form className="form-horizontal">
      <div className="invoice__separator"></div>
        {this.renderFacture()}
        {this.renderTotal()}
      </form>
    );
  },
});

export default Invoice;
