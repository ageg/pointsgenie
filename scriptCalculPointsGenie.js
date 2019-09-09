const url_mongo = 'mongodb://localhost/pointsgenie'
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const UserSchema = new Schema({
  data: {
    cip: { type: String, required: true, unique: true, lowercase: true, match: /^[a-z]{4}\d{4}$/ },
    email: { type: String, lowercase: true },
    name: { type: String },
    concentration: { type: Number },
    ringSize: { type: String },
    promocard: {
      price: { type: Number },
      date: { type: Date },
    },
    totalPoints: { type: Number },
    points: [{
      reason: { type: String, required: true },
      points: { type: Number },
    }],
    promInscription: {
      cost: { type: Number, default: 0 },
      phoneNumber: { type: String, default: ""  },
      concentration: { type: String, default: ""  },
      allergy: { type: String, default: ""  },
      emergencyContact: {
        name: { type: String, default: ""  },
        phoneNumber: { type: String, default: ""  },
        email: { type: String, default: ""  },
      },
      firstDay: {
        participation: { type: Boolean, default: false },
        occupation: { type: String, default: ""  },
        accompanied: { type: Boolean, default: false },
        accompanyingPersonName: { type: String, default: ""  },
      },
      secondDay: {
        participation: { type: Boolean, default: false },
        occupation: { type: String, default: ""  },
        accompanied: { type: Boolean, default: false },
        accompanyingPersonName: { type: String, default: ""  },
      },
      firstActivity: {
        participation: { type: Boolean, default: false },
        accompanied: { type: Boolean, default: false },
      },
      secondActivity: {
        participation: { type: Boolean, default: false },
        accompanied: { type: Boolean, default: false },
      }
    },
    invoiceConfirmed: { type: Boolean, default: false },
    factureJonc: { type: Number, default: 0 }, 
    factureVoyage: { type: Number, default: 0 },
    factureAlbum: { type: Number, default: 0 },
    factureManteau: { type: Number, default: 0 },
    facturePhotos: { type: Number, default: 0 },
    paid: {
      photo: { type: Number, default: 0 }, 
      voyage: { type: Number, default: 0 }
    },
    rebate: { type: Number, default: 0 }
  },
  meta: {
    password: { type: String },
    provider: { type : String },
    isAdmin: { type: Boolean, default: true }
  }
}, {
  toObject: { virtuals: true },
  toJSON : {
    virtuals: true,
    transform: function (doc, ret, options) {
      // Only act on the parent document
      if ("function" !== typeof doc.ownerDocument) {
        let retVal = ret.data;
        retVal.id = doc.id;
        retVal.created = doc.meta.created;
        retVal.isAdmin = doc.meta ? doc.meta.isAdmin : undefined;
        retVal.hasPassword = doc.hasPassword();
        return retVal;
      }
      ret.id = doc._id.toString();
      delete ret._id;
      return ret;
    }
  }
});

/**
 * Virtuals
 */
UserSchema.virtual('meta.created').get(function () {
  return this._id.getTimestamp();
});
UserSchema.virtual("password").set(function (password) {
  this.meta.password = password;
});
UserSchema.virtual("password").get(function () {
  return this.meta.password;
});
UserSchema.virtual("data.invoiceTotal").get(function () {
  return this.data.promInscription.cost + this.data.factureJonc + this.data.factureAlbum 
  + this.data.factureManteau + this.data.facturePhotos + this.data.factureVoyage;
});
UserSchema.virtual("data.invoiceBalance").get(function () {
  return this.data.promInscription.cost + this.data.factureJonc + this.data.factureAlbum 
  + this.data.factureManteau + this.data.facturePhotos + this.data.factureVoyage - this.data.paid.voyage
  - this.data.paid.photo - this.data.rebate;
});
UserSchema.virtual("data.valeurPoint").get(function () {
  return Math.round(this.data.rebate / this.data.totalPoints * 100) / 100;
});
UserSchema.virtual("data.paidTotal").get(function () {
  return this.data.paid.voyage + this.data.paid.photo;
});

mongoose.model("User", UserSchema);
var User = mongoose.model("User");

// Javascript et les décimals...
function round2Decimal(number) {
  return Math.round(number * 100) / 100;
}


mongoose.connect(url_mongo, function (err) {
  // verifyTotalPoints();
  // calculateRebate();
  // totalReimburse();
  // printCSV();

  // Make sure totalPoints is up to date
  function verifyTotalPoints() {
    User.find({}, (err, users) => {
      mongoose.connection.close();

      users.forEach((user) => {
        let points = 0;
        user.data.points.forEach((point) => {
          points += point.points;
        })
        let totalPoints = user.data.totalPoints;
        if (totalPoints === undefined) totalPoints = 0;

        if (points != totalPoints) {
          console.log(user.data.cip);
        }
      });
    });
  }

  function calculateRebate() {
    let solde = 215707.43;
    const soldeMin = 350; // Nécessaire pour ne pas tomber à un solde négatif dû au round de 2 décimals

    User.find({}, (err, users) => {
      let nbrPointGenie = 0;

      users.forEach((user, index) => {
        user.data.rebate = 0;
        if (user.data.totalPoints) nbrPointGenie += user.data.totalPoints;
      });

      let billAllPaid;
      do {
        billAllPaid = true;
        const valeurPoint = solde / nbrPointGenie;
        console.log('solde:' + solde);
        console.log('nbrPointGenie: ' + nbrPointGenie)
        console.log('valeurPoint: ' + valeurPoint)

        users.forEach((user, index) => {
          if (!user.data.invoiceTotal || !user.data.totalPoints || user.data.totalPoints == 0) {
            
          } else {
            // Si la personne n'a pas sa facture complètement payée
            if (user.data.rebate !== user.data.invoiceTotal) {
              billAllPaid = false;
              const currentRebate = valeurPoint * user.data.totalPoints;

              // Si le total des rabais précédents et du actuel dépasse la facture totale
              // On rembourse seulement ce qui reste à rembourser
              if (currentRebate + user.data.rebate >= user.data.invoiceTotal) {
                const partialRebate = user.data.invoiceTotal - user.data.rebate;

                user.data.rebate += partialRebate;
                solde -= partialRebate;
                user.data.rebate = round2Decimal(user.data.rebate);
                solde = round2Decimal(solde);

                nbrPointGenie -= user.data.totalPoints;
              // Donc si la facture ne sera pas remboursée entièrement à cette itération
              }  else {
                user.data.rebate += currentRebate;
                solde -= currentRebate;
                user.data.rebate = round2Decimal(user.data.rebate);
                solde = round2Decimal(solde);
              }
            }
            else if (user.data.rebate > user.data.invoiceTotal) {
              throw new Error('ERREUR, le rabais ne peut pas être plus grand que la facture');
            }
          }
        });
        console.log('');
      }
      while (solde > soldeMin && !billAllPaid); // Si le solde est à 0 ou toutes les factures sont payées

      console.log('Solde final:' + solde);
      const savePromises = [];
      users.forEach((user) => {
        savePromises.push(user.save());
      });
      Promise.all(savePromises)  
        .then(() => {
          mongoose.connection.close();
        });
    });
  }

  // Somme de toutes les balances
  function totalReimburse() {
    User.find({}, (err, users) => {
      mongoose.connection.close();
      let balance = 0;

      users.forEach((user, index) => {
        balance += user.data.invoiceBalance;
      });
      console.log(balance)
    });
  }

  function printCSV() {
    User.find({}, (err, users) => {
      mongoose.connection.close();
      console.log('Nom,Nombre points,Valeur point,Invoice total,Rebate,Paid total,Invoice balance')

      users.forEach((user, index) => {
        const { name, totalPoints, valeurPoint, invoiceTotal, rebate, paidTotal, invoiceBalance } = user.data;
        console.log(`${name},${totalPoints},${valeurPoint},${invoiceTotal},${rebate},${paidTotal},${invoiceBalance}`)
      });
    });
  }
});
