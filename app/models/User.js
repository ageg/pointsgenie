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
    totalPoints: { type: Number },
    authorization: { type: Object, shape: {
        date: { type: Date },
      },
    }
  };
}

export default User;
