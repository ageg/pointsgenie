const TEST = {
  isAdmin: function (user) {
    return (user && (user.meta.isAdmin === true));
  },
  isAuthorized: function (user) {
    return (user && user.data.authorization && user.data.authorization.date);
  },
};

exports.isConnected = function *(next) {
  if (this.isAuthenticated()) {
    yield next;
  } else {
    this.throw("Vous devez être connecté pour accédez à cette page", 401);
  }
};

exports.isAdmin = function *(next) {
  if (TEST.isAdmin(this.passport.user)) {
    yield next;
  } else {
    this.throw("Vous n'avez pas les droits suffisant pour accédez à cette page", 403);
  }
};

exports.isAuthorized = function *(next) {
  if (TEST.isAdmin(this.passport.user) || TEST.isAuthorized(this.passport.user)) {
    yield next;
  } else {
    this.throw("Vous n'avez pas l'autorisation accédez à cette page", 403);
  }
};

