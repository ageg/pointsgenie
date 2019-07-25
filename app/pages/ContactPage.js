import React, { Component } from "react";

class ContactPage extends Component {
  static displayName = "ContactPage";

  render () {
    return (
      <div className="description">
        <h2>Contact - Automne 2018</h2>

        <h3>Comité exécutif</h3>
        <p>
          <b>Présidente</b> - Sophie Laflamme <br/>
          <b>Vice-Président, Directeur Points Genie</b> - Guillaume Gagnon <br/>
          <b>Secrétaire</b> - Chloé Desmarais <br/>
          <b>Trésorier</b> - Marc-Antoine Godin <br/>
          <b>Webmestre</b> - Noémie Landry-Boisvert <br/>
          <b>Directeurs 5@8</b> - <a href="mailto:5a8@ageg.ca">Simon Milhomme et Vincent Tremblay</a> <br/>
          <b>Directeur Affaires Sociales</b> - <a href="https://www.ikea.com/ca/fr/catalog/products/50332238/">La chaise</a> <br/>
          <b>Directeur Bal et Voyage</b> - Alexandre Gagnon <br/>
          <b>Directrice Souvenirs</b> - Gabrielle Lebeau <br/>
          <b>Directrice Jonc et Casino</b> - Andrea Figueroa Mendez
        </p> 
    
        <h3>Comité 5@8</h3>
        <p>
          <b>Directeurs 5@8</b> - <a href="mailto:5a8@ageg.ca">Simon Milhomme et Vincent Tremblay</a> <br/>
          <b>Sous-Directeur Animation </b> - Alexandre Gagnon <br/>
          <b>Sous-Directeur Bière </b> - Jean-François Bilodeau <br/>
          <b>Sous-Directeur Bière</b> - Émile Brunelle-Camirand <br/>
          <b>Sous-Directrice Repas</b> - Jacinthe Raymond <br/>
          <b>Sous-Directrice Caisse</b> - Sarah Dion <br/>
          <b>Sous-Directrice Fort </b> - Noémie Boisvert-Landry <br/>      
          <b>Sous-Directrice Fort</b> - Camillia McPhail <br/>
          <b>Sous-Directrice Sécurité</b> - Andrea Figueroa Mendez <br/>
          <b>Sous-Directeur Radio</b> - Dylan Rochat
        </p>
      </div>  
    );
  }
};

export default ContactPage;
