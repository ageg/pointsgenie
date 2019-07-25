"use strict";
var path = require("path");
var _ = require("lodash");

var env = process.env.NODE_ENV = process.env.NODE_ENV || "development";

var base = {
  app: {
    root: path.normalize(__dirname + "/.."),
    env: env,
  },
  ldap: {
    url: "ldaps://ldap.usherbrooke.ca:636",
    base: "ou=personnes,dc=usherbrooke,dc=ca",
    username: process.env.LDAP_USER,
    password: process.env.LDAP_PASSWORD,
  },
};

var specific = {
  development: {
    app: {
      port: 3000,
      name: "Points genie - Dev",
      keys: ["super-secret-hurr-durr"],
      proxy: true,
    },
    mongo: {
      url: "mongodb://localhost/pointsgenie_dev",
    },
    cas: {
      proxyUrl: 'localhost:3000',
    },
  },
  test: {
    app: {
      port: 3001,
      name: "Points genie - Test realm",
      keys: ["super-secret-hurr-durr"],
    },
    mongo: {
      url: "mongodb://localhost/pointsgenie_test",
    },
    ldap: {
      url: "ldaps://example.com",
      base: "base",
      username: "dummy",
      password: "dummy",
    },
    cas: {
      proxyUrl: 'dummy',
    },
  },
  production: {
    app: {
      port: process.env.PORT || 6161,
      name: "Points genie",
      proxy: true,
      keys: ["super-secret-hurr-durr"]
    },
    mongo: {
      url: "mongodb://localhost/promo61",
    },
    cas: {
      proxyUrl: process.env.CAS_PROXY_URL || 'promo61.ageg.ca',
    },
  }
};

module.exports = _.merge(base, specific[env]);
