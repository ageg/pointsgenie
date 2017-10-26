
import React, { Component } from "react";
import {Button} from "react-bootstrap";

class FAQPage extends Component {
  static displayName = "FAQPage";

  render() {
    return (
      <div className="faq">
        <h3>Foire aux questions</h3>
        <h5>S.V.P veuillez consulter la charte pour avoir plus d'informations:</h5>
        <Button bsStyle="primary" href="/charte-a17.pdf">Charte</Button>
        <hr/>

        <h4>À quoi servent les Points Génie?</h4>
        <blockquote>Les Points Génie permettront, en bonne partie, de payer les différents frais reliés à la graduation pour la promotion finissante (Photo des finissants, album, voyage de la finissante, Jonc, etc.)</blockquote>

        <h4>Pourquoi avons-nous une promo carte?</h4>
        <blockquote>La promocarte permet aux étudiantes de la promotion finissante de postuler à des événements tels que les 5@8. Celle-ci est traditionnellement attibuée par le Directrice Point Génie à tous les étudiants figurant sur la liste de la promotion de la faculté. Cette carte est strictement virtuelle et n'est pas transférable.</blockquote>

        <h4>Combien vaut un Point Génie ?</h4>
        <blockquote>La valeur d’un Point Génie sera seulement connue au mois de novembre 2018, car la valeur du Point Génie est calculée en fonction du montant total accumulé par la promotion finissante ainsi que du nombre de points distribués. Le calcul pour évaluer la valeur du point génie est présenté dans le règlement 6 de la charte de la 60e promotion.</blockquote>

        <h4>Comment les personnes travaillant pour un évènement sont-elles choisies ?</h4>
        <blockquote>Sur toutes les personnes ayant appliqué, ce sont celles ayant le moins de Points Génie qui seront priorisées (à une différence de 3 points). Le choix se fera aussi en fonction des tâches préférées.
        Par contre, notez que les tâches préférées sont assignées en fonction des disponibilités des postes et non en fonction des Points Génie et que celles-ci ne sont que de nature informative.
        Pour plus d'information sur l'affichage des postes, vous référer à la charte de la 60e promotion ou contacter votre Directrice Points Génie.</blockquote>

        <h4>À partir de quand est-il possible de postuler pour un évènement?</h4>
        <blockquote>Pour les 5@8, la phase de postulation débutera le dimanche 18h jusqu’à mardi 18h la semaine courante de l’évènement.
        Pour les autres évènements, le début de la phase de postulation sera annoncée par courriel USherbrooke.</blockquote>

        <h4>Qui dois-je contacter en cas de problème ou si j'ai des questions? </h4>
        <blockquote>Pour ce qui est de la distribution des Points Génie, contacter Béatrice Laroche, Directrice Points Génie. Pour ce qui est en lien avec le fonctionnement du site web, contacter Raphaël Drouin, Webmestre. </blockquote>
      </div>
    );
  }
};

export default FAQPage;
