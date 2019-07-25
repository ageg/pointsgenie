# Site des points Genie UdeS

This is the source code for the "Points Genie" site, created for the 57th promo of Engineering at UdeS. This is the version for the 61st promoition.

[![Build Status](https://travis-ci.org/NewLunarFire/pointsgenie.svg?branch=master)](https://travis-ci.org/NewLunarFire/pointsgenie)

## Basics

To install, first install npm, nodejs@8 and mongodb then do

    npm install

You can run tests using

    npm tests

You can start the server in dev mode using two terminals

 - First: `npm run hot-dev-server`
 - Second: `LDAP_USER="uid=<CIP>" LDAP_PASSWORD="<PASSWORD>" npm start`

For production, make sure all the files are built using

    npm run build

Then run

    node --harmony server
