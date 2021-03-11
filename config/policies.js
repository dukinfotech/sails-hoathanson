/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  '*': ['is-logged-in', 'set-default-layout'],
  // Actions below will not run middleware 'is-logged-in' and 'set-default-layout'
  'auth/show-register': true,
  'auth/register': true,
  'auth/show-login': true,
  'auth/login': true,
  // Because conflict between Sails and express-ejs-layout, so set default layout here
  'pages/*': 'set-default-layout',
  'pages/m16': ['is-logged-in', 'set-default-layout'],
  'pages/m25': ['is-logged-in', 'set-default-layout'],
  'markets/m10-1/*': true,
  'markets/m10-2/*': true,
  'markets/m15': true,
  'markets/m20': true,
  'markets/m30': true,
};
