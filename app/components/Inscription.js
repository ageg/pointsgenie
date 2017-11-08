import React, { PropTypes } from "react";
import { Input, Button, Alert, Pager } from "react-bootstrap";
import _ from "lodash";

import request from "../middlewares/request";

const Inscription = React.createClass({
  displayName: "Inscription",

  propTypes: {
    promInscription: PropTypes.object,
  },

  getInitialState() {
    return {
      promInscription: this.props.promInscription
    };
  },

  handleChange(event) {
    const inscription = this.state.promInscription;
    _.set(inscription, event.target.name, event.target.type === "checkbox" ? event.target.checked : event.target.value);
    this.setState({promInscription: inscription});
    this.calculatePromSubtotal(this.state.promInscription);
  },

  handleSubmit(event) {
    event.preventDefault();

    const body = {promInscription: this.state.promInscription};

    request.post("/users/me/promInscription", body, (err, res) => {
      let state = {};

      // TODO: Add user feedback on processing/error/success
      if (err) {
        state.alert = {style: "danger", message: "Erreur non-controlée: " + err.message};
      } else if (res.status === 200) {
        state.alert = {style: "success", message: "Changement effectué!"};
      } else {
        state.alert = {style: "danger", message: res.body.error};
      }
      this.setState(state);
    });
  },

  calculatePromSubtotal(promInscription) {
    const prixMixologie = 25;
    const dayOneCost = this.calculateOneDayOccupationCost(promInscription.firstDay, true);
    const dayTwoCost = this.calculateOneDayOccupationCost(promInscription.secondDay, false);
    let promTotal = dayOneCost + dayTwoCost;

    if (promInscription.secondActivity.participation) {
      if (promInscription.secondActivity.accompanied) {
        promTotal += prixMixologie * 2;
      } else {
        promTotal += prixMixologie;
      }
    }

    this.setState({promInscription: {
      ...this.state.promInscription,
      cost: promTotal
    }});
  },

  calculateOneDayOccupationCost(occupationInfo, isFirstDay) {
    let subtotal = 0;

    if (occupationInfo.participation) {
      switch(occupationInfo.occupation) {
        case "Simple":
          subtotal = isFirstDay ? 411.50 : 414.50;
          break;
        case "Double":
          subtotal = isFirstDay ? 333.50 : 336.50;
          break;
        case "Triple":
          subtotal = isFirstDay ? 316.50 : 319.50;
          break;
        case "Quadruple":
          subtotal = isFirstDay ? 307.50 : 310.50;
          break;
      }

      if (occupationInfo.accompanied === true) {
        subtotal = subtotal * 2;
      }
    }

    return subtotal;
  },

  renderInscriptionFields: function() {
    let options = ["", "Mécanique", "Chimique", "Biotech", "Électrique", "Informatique", "Civil"],
    makeOption = function(option) {
      return <option key={options.indexOf(option)}>{option}</option>;
    };
    return(
      <div>
        <Input ref="phoneNumberInput" type="text" label="Numéro de téléphone" labelClassName="col-sm-3" 
        wrapperClassName="col-sm-6" onChange={this.handleChange} name="phoneNumber" value={this.state.promInscription.phoneNumber} />
        <Input ref="concentrationSelect" type="select" label="Concentration" labelClassName="col-sm-3" 
        wrapperClassName="col-sm-6" onChange={this.handleChange} name="concentration" value={this.state.promInscription.concentration}>
            {options.map(makeOption)}
        </Input>
        <Input ref="allergiesInput" type="text" label="Allergies" labelClassName="col-sm-3" 
          wrapperClassName="col-sm-6" onChange={this.handleChange} name="allergy" value={this.state.promInscription.allergy} />
      </div>  
    );
  },

  renderContactUrgence: function() {
    return(
      <div>
        <Input ref="allergiesInput" type="text" label="Nom" labelClassName="col-sm-3" 
          wrapperClassName="col-sm-6" name="emergencyContact.name" onChange={this.handleChange} value={this.state.promInscription.emergencyContact.name} />
        <Input ref="allergiesInput" type="text" label="Numéro de téléphone" labelClassName="col-sm-3" 
          wrapperClassName="col-sm-6" name="emergencyContact.phoneNumber" onChange={this.handleChange} value={this.state.promInscription.emergencyContact.phoneNumber} />
        <Input ref="allergiesInput" type="text" label="Courriel" labelClassName="col-sm-3" 
          wrapperClassName="col-sm-6" name="emergencyContact.email" onChange={this.handleChange} value={this.state.promInscription.emergencyContact.email} />
      </div>
    );
  },

  renderActivityFields: function() {
    let options = ["", "Simple", "Double", "Triple", "Quadruple"],
    makeOption = function(option) {
      return <option key={options.indexOf(option)}>{option}</option>;
    };
    return(
      <div>
        <h4>20 décembre</h4>
        <Input type="checkbox" label="Je participe" ref="part20"
          wrapperClassName="col-sm-offset-3 col-sm-6" labelClassName="col-sm-6" name="firstDay.participation" onChange={this.handleChange} checked={this.state.promInscription.firstDay.participation}/>
        <Input ref="occupation20Select" type="select" label="Occupation" labelClassName="col-sm-3" 
          wrapperClassName="col-sm-6" name="firstDay.occupation" onChange={this.handleChange} value={this.state.promInscription.firstDay.occupation}>
            {options.map(makeOption)}
        </Input>

        <Input type="checkbox" label="Accompagné" ref="acc20" checked={this.state.promInscription.firstDay.accompanied}
          onChange={this.handleChange} name="firstDay.accompanied" labelClassName="col-sm-6" wrapperClassName="col-sm-offset-3 col-sm-6"/>
        <Input ref="nomAccompagnateur20" type="text" label="Nom de l'accompagnateur" labelClassName="col-sm-3" 
        wrapperClassName="col-sm-6" name="firstDay.accompanyingPersonName" onChange={this.handleChange} value={this.state.promInscription.firstDay.accompanyingPersonName} />
      
        <h4>21 décembre</h4>
        <Input type="checkbox" label="Je participe" ref="part21"
          onChange={this.handleChange} name="secondDay.participation" checked={this.state.promInscription.secondDay.participation} labelClassName="col-sm-6" wrapperClassName="col-sm-offset-3 col-sm-6"/>
        <Input ref="occupation20Select" type="select" label="Occupation" labelClassName="col-sm-3" 
          wrapperClassName="col-sm-6" onChange={this.handleChange} name="secondDay.occupation" value={this.state.promInscription.secondDay.occupation}>
            {options.map(makeOption)}
        </Input>
      
        <Input type="checkbox" label="Accompagné" ref="acc20" checked={this.state.promInscription.secondDay.accompanied} name="secondDay.accompanied"
          labelClassName="col-sm-6" wrapperClassName="col-sm-offset-3 col-sm-6" onChange={this.handleChange} />
        <Input ref="nomAccompagnateur20" type="text" label="Nom de l'accompagnateur" labelClassName="col-sm-3" 
        wrapperClassName="col-sm-6" onChange={this.handleChange} name="secondDay.accompanyingPersonName" value={this.state.promInscription.secondDay.accompanyingPersonName} />
      
        <h4>Ski le 20 décembre (payé séparément)</h4>
        <Input type="checkbox" label="Je participe" ref="ski20"
          labelClassName="col-sd-6" name="firstActivity.participation" onChange={this.handleChange} wrapperClassName="col-sm-offset-3 col-sm-6" checked={this.state.promInscription.firstActivity.participation}/>
        <Input type="checkbox" label="Je serai accompagné" ref="accSki20"
          labelClassName="col-sd-6" name="firstActivity.accompanied" onChange={this.handleChange} wrapperClassName="col-sm-offset-3 col-sm-6" checked={this.state.promInscription.firstActivity.accompanied}/>
      
        <h4>Mixologie 21 décembre</h4>
        <Input type="checkbox" label="Je participe" ref="mixo21"
          labelClassName="col-sd-6" name="secondActivity.participation" onChange={this.handleChange} wrapperClassName="col-sm-offset-3 col-sm-6" checked={this.state.promInscription.secondActivity.participation}/>
        <Input type="checkbox" label="Je serai accompagné" ref="accMixo20"
          labelClassName="col-sd-6" name="secondActivity.accompanied" onChange={this.handleChange} wrapperClassName="col-sm-offset-3 col-sm-6" checked={this.state.promInscription.secondActivity.accompanied}/>
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

  renderTotal() {
    return (
      <div style={{paddingBottom: 30}}>
        <h4>TOTAL: {this.state.promInscription.cost} $</h4>
        Sujet à changer en fonction du nombre d'inscriptions
      </div>
    );
  },

  render: function() {
    return (
      <form className="form-horizontal" onSubmit={this.handleSubmit}>
        {this.renderInscriptionFields()}
        <h3>Personne à contacter en cas d'urgence</h3>
        {this.renderContactUrgence()}
        <br/>
        <h3>Participation aux activités</h3>
        {this.renderActivityFields()}
        <Pager>
          {this.renderTotal()}
          {this.renderMessage()}
          <Button type="submit" bsStyle="primary">
            Sauvegarder
          </Button>
        </Pager>
      </form>
    );
  },
});

export default Inscription;
