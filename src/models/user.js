/**
 * Dependencies
 */
var bcrypt = require("../../lib/bcrypt-thunk"); // version that supports yields
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var co = require("co");

var Ldap = require("../../lib/ldap.js");
// @TODO do me better
var LdapInstance = new Ldap();

/**
 * Constants
 */
const SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  data: {
    cip: { type: String, required: true, unique: true, lowercase: true, match: /^[a-z]{4}\d{4}$/ },
    email: { type: String, lowercase: true },
    name: { type: String },
    concentration: { type: Number },
    ringSize: { type: String },
    authorization: {
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
    isAdmin: { type: Boolean, default: false }
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

/**
 * Middlewares
 */
UserSchema.pre("save", function (done) {

  // If a modifications has been done on points log, recalculate the total points
  if (this.isModified("data.points")) {
    var totalPoints = 0;
    for (var i = 0; i < this.data.points.length; ++i) {
      totalPoints += this.data.points[i].points;
    }
    this.data.totalPoints = totalPoints;
  }

  // Only hash the password if it has been modified (or is new)
  if (!this.meta.password || this.meta.password.length < 1 || !this.isModified("meta.password")) {
    return done();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR)
  .then(function (salt) {
    return bcrypt.hash(this.meta.password, salt)
  }.bind(this))
  .then(function (hash) {
    this.meta.password = hash;
    done();
  }.bind(this))
  .catch(done);
});

/**
 * Methods
 */

UserSchema.methods.comparePassword = function *(candidatePassword) {
  // User password is not set yet
  if (!this.hasPassword()) { return false; }
  return yield bcrypt.compare(candidatePassword, this.meta.password);
};

UserSchema.methods.hasPassword = function () {
  return (typeof this.meta.password == "string") && (this.meta.password.length > 0);
};

UserSchema.methods.awardPoints = function (giver, points, rawReason) {
  // Get current date
  var date = (new Date().toISOString().split("T"))[0];
  // @TODO export that to a module, so we can test the format
  var reason = date + ": " + giver + " -- " + rawReason;

  this.data.points = this.data.points || [];
  this.data.points.push({
    points: points,
    reason: reason,
  });
};

/**
 * Statics
 */

UserSchema.statics.findByCip = function (cip) {
  return this.findOne({ "data.cip": cip.toLowerCase() });
};

UserSchema.statics.findAndComparePassword = function *(cip, password) {
  var user = yield this.findByCip(cip).exec();

  if (!user) { throw new Error("User not found"); }

  if (yield user.comparePassword(password)) {
    user.meta.provider = "local";
    yield user.save();
    return user;
  }
  console.log("findAndComparePassword", "not match")
  throw new Error("Password does not match");
};

UserSchema.statics.fetchInfoFromLDAP = function *(cip, user) {
  var ldapAnswer = yield LdapInstance.searchByCipThunk(cip);
  fillInfosFromLDAP(ldapAnswer[0], user);
};

UserSchema.statics.createNewUser = function (profile) {
  console.log('inside src/model')
  console.log(profile)
  return this.findOne({ "data.cip": profile.toLowerCase() });
  //user = new this({ data: { cip: profile.cip} });
  //user.data.email = profile.email
  //user.data.name = profile.name
  //user.meta.provider = "app-function";

  //yield user.save();

  //return user;
};

UserSchema.statics.findOrCreateUser = function *(profile, casRes) {
  var user = yield this.findOne({ "data.cip": profile.id }).exec();

  if (!user) {
    user = new this({ data: { cip: profile.id } });
  }

  fillInfosFromCAS(profile, user);

  if (!user.data.email) {
    // Fetch User infos from LDAP
    yield this.fetchInfoFromLDAP(profile.id, user);
  }

  user.meta.provider = profile.provider;
  yield user.save();

  return user;
};

function fillInfosFromLDAP (profile, user) {
  user.data.email = profile.mail
  user.data.name = profile.cn;
}

function fillInfosFromCAS (profile, user) {
  if (!profile.emails) {
    // We dont have informations
    return;
  }
  user.data.email = profile.emails[0].value;
  user.data.name = profile.displayName;
};

// Model creation
mongoose.model("User", UserSchema);
