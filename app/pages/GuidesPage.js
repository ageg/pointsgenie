
import React, { Component } from "react";
import {Button} from "react-bootstrap";

class GuidesPage extends Component {
  static displayName = "GuidesPage";

  render() {
    return (
      <div className="guides">
        <h3>Guides du parfait bénévole</h3>
        <blockquote>T'es bénévole pour le prochain événement? Tu sais pas comment faire ou ce que t'as le droit de faire? Consulte les guides ci-dessous pour en apprendre plus sur le déroulement normal d'une soirée de bénévolat.</blockquote>

        <h4>Guide du bénévole Sécurité</h4>
        <blockquote>C'est toi qui est le boss icite? Tu veux montrer tes gros bras? Voici ce que tu peux et ne peux pas faire.</blockquote>
        <Button bsStyle="primary" href="/guides/guide-securite.pdf">Guide du parfait bénévole sécurité</Button>
        <hr/>

        <h4>Guide du parfait barman</h4>
        <blockquote>Tu sers du jus de party au prochain événement? Explore ces deux documents pour en connaître plus sur ce métier temporaire.</blockquote>
        <Button bsStyle="primary" href="/guides/guide-biere.pdf">Guide du parfait bénévole bière</Button>
        <hr/>
        <Button bsStyle="primary" href="/guides/guide-fort.pdf">Guide du parfait bénévole fort</Button>
        <hr/>

      </div>
    );
  }
};

export default GuidesPage;
