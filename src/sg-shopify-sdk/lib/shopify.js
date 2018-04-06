'use strict';

let resources = {
    Products : require('./resources/Products'),
    Collections : require('./resources/Collections'),
    Orders : require('./resources/Orders'),
    Customers : require('./resources/Customers'),
    Webhooks : require('./resources/Webhooks'),
    Collects : require('./resources/Collects')
};

Shopify.resources = resources;

function Shopify(config) {

  if (!(this instanceof Shopify)) {
    return new Shopify(config);
  } 

  this._api = {
    auth: null,
    domain: null
  };

  this._prepResources();
  this._setMyShopifyDomain(config.myShopifyDomain);
  this._setAuthHeader(config.apiKey, config.password);
}


Shopify.prototype = {

  _setMyShopifyDomain: function(domain) {
    this._setApiField('domain', domain);
  },

  _setAuthHeader: function(apiKey, password) {
    if (apiKey && password) {
      this._setApiField(
        'auth',
        'Basic ' + new Buffer(apiKey + ':' + password).toString('base64')
      );
    }
  },

  _setApiField: function(key, value) {
    this._api[key] = value;
  },

  getApiField: function(key) {
    return this._api[key];
  },

  _prepResources: function() {
    for (let name in resources) {
      this[
        name[0].toLowerCase() + name.substring(1)
      ] = new resources[name](this);
    }
  },

};

module.exports = Shopify;
module.exports.Shopify = Shopify;