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

  handleConfirmClick() {
    const body = {invoiceConfirmed: true};
    
    request.post("/users/me/confirmInvoice", body, (err, res) => {
      let state = {};

      // TODO: Add user feedback on processing/error/success
      if (err) {
        state.alert = {style: "danger", message: "Erreur non-controlée: " + err.message};
      } else if (res.status === 200) {
        state.alert = {style: "success", message: "Changement effectué!"};
        this.setState({user: {...this.state.user, invoiceConfirmed: true}});
      } else {
        state.alert = {style: "danger", message: res.body.error};
      }
      this.setState(state);
    });
  },

  renderFacture: function() {
    return(
      <div className="invoice__items">
        <div className="row invoice__spacer">
          <div className="col-sm-offset-1 col-sm-5 invoice__column-title">Articles</div>
          
          <div className="col-sm-5 invoice__column-title invoice__column-price">Prix</div>
        </div>

        <div className="row invoice__spacer">
          <div className="col-sm-offset-1 col-sm-5">Jonc et billets pour la cérémonie</div>
          
          <div className="col-sm-5 invoice__column-price">{this.state.user.factureJonc} $</div>
        </div>

        <div className="row">
          <div className="col-sm-offset-1 col-sm-5">Voyage</div>
          
          <div className="col-sm-5 invoice__column-price">{this.state.user.factureVoyage} $</div>
        </div>

        <div className="row">
          <div className="col-sm-offset-1 col-sm-5">Bal</div>
          
          <div className="col-sm-5 invoice__column-price">{this.state.user.promInscription.cost} $</div>
        </div>

        <div className="row">
          <div className="col-sm-offset-1 col-sm-5">Album</div>
          
          <div className="col-sm-5 invoice__column-price">{this.state.user.factureAlbum} $</div>
        </div>

        <div className="row">
          <div className="col-sm-offset-1 col-sm-5">Photos</div>

          <div className="col-sm-5 invoice__column-price">{this.state.user.facturePhotos} $</div>
        </div>

        <div className="row">
          <div className="col-sm-offset-1 col-sm-5">Manteau</div>

          <div className="col-sm-5 invoice__column-price">{this.state.user.factureManteau} $</div>
        </div>

        <div className="row">
          <div className="col-sm-offset-1 col-sm-5">Déjà payé (photos)</div>
          
          <div className="col-sm-5 invoice__column-price">- {this.state.user.paid ? this.state.user.paid.photo : 0} $</div>
        </div>

        <div className="row">
          <div className="col-sm-offset-1 col-sm-5">Déjà payé (voyage)</div>
          
          <div className="col-sm-5 invoice__column-price">- {this.state.user.paid ? this.state.user.paid.voyage : 0} $</div>
        </div>

        <div className="row">
          <div className="col-sm-offset-1 col-sm-5">Points génies ({this.state.user.valeurPoint}$/point)</div>

          <div className="col-sm-5 invoice__column-price">- {this.state.user.rebate ? this.state.user.rebate : 0} $</div>
        </div>
      </div>
    );
  },

  renderTotal() {
    const balance = this.state.user.invoiceBalance;
    return (
      <div>
        <div className="row">          
          <div className="col-sm-offset-1 col-sm-10 invoice__column-total">Sous-Total: {balance} $</div>
        </div>
      </div>
    );
  },

  renderMessage() {
    if (this.state.alert) {
      return (
        <Alert bsStyle={this.state.alert.style} >
          {this.state.alert.message}
        </Alert>
      );
    }
    return null;
  },

  renderConfirmation() {
    const invoiceConfirmed = this.state.user.invoiceConfirmed;

    return (
      <div className="invoice__confirmation">
        <div className="invoice__separator"></div>
        <div className="invoice__confirmation-message">Je confirme que ma facture est exacte.</div>
        {this.renderMessage()}
        <Button onClick={this.handleConfirmClick} bsStyle="primary" disabled={invoiceConfirmed}>
          {invoiceConfirmed ? 'Facture confirmée' : 'Confirmer ma facture'}
        </Button>
      </div>
    );
  },

  render: function() {
    return (
      <div>
        <form className="form-horizontal">
          <div className="invoice__separator"></div>
          {this.renderFacture()}
          {this.renderTotal()}
        </form>
        {this.renderConfirmation()}
      </div>
    );
  },
});

export default Invoice;
