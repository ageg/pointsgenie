import Model from "./Model";

class User extends Model {
  static schema = {
    id: { type: String },
    cip: { type: String },
    name: { type: String },
    email: { type: String },
    ringSize: { type : String },
    isAdmin: { type: Boolean },
    hasPassword: { type: Boolean, private: true },
    created: { type: Date },
    points: [ {
      type: Object,
      shape: {
        id: { type: String },
        reason: { type: String },
        points: { type: Number },
      },
    } ],
    promInscription: { type: Object, shape: {
        cost: { type: Number },
        phoneNumber: { type: String },
        concentration: { type: String },
        allergy: { type: String },
        emergencyContact: { type: Object, shape: {
            name: { type: String },
            phoneNumber: { type: String },
            email: { type: String },
          }
        },
        firstDay: { type: Object, shape: {
            participation: { type: Boolean },
            occupation: { type: String },
            accompanied: { type: Boolean },
            accompanyingPersonName: { type: String },
          }
        },
        secondDay: { type: Object, shape: {
            participation: { type: Boolean },
            occupation: { type: String },
            accompanied: { type: Boolean },
            accompanyingPersonName: { type: String },
          }
        },
        firstActivity: { type: Object, shape: {
            participation: { type: Boolean },
            accompanied: { type: Boolean },
          }
        },
        secondActivity: { type: Object, shape: {
            participation: { type: Boolean },
            accompanied: { type: Boolean },
          }
        }
      }
    },
    totalPoints: { type: Number },
    promocard: { type: Object, shape: {
        price: { type: Number },
        date: { type: Date },
      },
    },
    paid: { type: Object, shape: {
        photo: { type: Number },
        voyage: { type: Number }
      },
    },
    factureJonc: { type: Number },
    factureAlbum: { type: Number },
    facturePhotos: { type: Number },
    factureManteau: { type: Number },
    factureVoyage: { type: Number },
    invoiceBalance: { type: Number },
    invoiceTotal: { type: Number }
  };
}

export default User;
