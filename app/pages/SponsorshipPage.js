
import React, { Component } from "react";
import {Button} from "react-bootstrap";

class SponsorshipPage extends Component {
  static displayName = "SponsorshipPage";

  render() {
    return (
      <div className="sponsorship">
        <h3>Commandites</h3>
        <blockquote>Les commandites sont de l’argent recueilli par les membres de la promotion qui servira à financer les activités de la promotion finissante. Les commanditaires ont la possibilité de donner un montant proportionnel à la grandeur de la publicité accordée dans l’album, le média électronique et tout autre article, selon un barème déterminé par le Président. 
</blockquote>
        <Button bsStyle="primary" href="/commandite-a17.pdf">Document de commandite A17</Button>
        <hr/>

        <h4>Information générale</h4>
        <blockquote>Un montant pouvant aller jusqu’à 20% du montant total de la commandite pourra être versé en commission dans le compte de l’avoir personnel du membre en question. Si le membre désire se prévaloir du montant partiel ou total de sa commission, il devra en informer le directeur Points Génie qui verra à inscrire cette somme à son compte personnel. Voir le règlement 6 pour plus de détails concernant l’avoir personnel des membres.</blockquote>
        <blockquote>Dans le cas de commandites en biens, articles, rabais ou toute autre valeur qui n’est pas directement en argent, une récompense pourra être versée au membre si la commandite en question permet à la promotion de réaliser un profit et/ou une économie. Cette récompense sera déterminée par le directeur Points Génie et pourra aller jusqu’à 20% de la valeur marchande réelle et courante du bien en question.</blockquote>

        <h4>Procédure</h4>
        <blockquote>Lorsqu’un membre de la promotion procure une commandite, il doit transmettre l’information au comité exécutif actif. Ceci permettra au comité d’entreprendre les actions nécessaires pour ajouter la commandite dans le compte personnel du membre ainsi que dans le comte commun des membres et de respecter ses engagements envers les commandites.</blockquote>
      
        <h4>Date limite</h4>
        <blockquote>Après le 12 septembre, l’album et les chandails de comité organisateur d’activité de financement ne seront plus disponibles pour l’ajout de logo de partenaire. Conséquemment, le niveau de visibilité sera moins important à la suite de cette date.</blockquote>
      </div>
    );
  }
};

export default SponsorshipPage;
