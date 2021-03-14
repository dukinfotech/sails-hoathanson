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
  // ACL for pages require login
  'pages/*': 'set-default-layout',
  'pages/m16': ['is-logged-in', 'set-default-layout'],
  'pages/m25': ['is-logged-in', 'set-default-layout'],
  'pages/m31': ['is-logged-in', 'set-default-layout'],
  'pages/m51': ['is-logged-in', 'set-default-layout'],
  'pages/m15-extra': ['is-logged-in', 'set-default-layout'],
  'pages/summary': ['is-logged-in', 'set-default-layout'],
  // ACL for API not require login
  'markets/m10-1/*': true,
  'markets/m10-2/*': true,
  'markets/m15': true,
  'markets/m20': true,
  'markets/m30': true,
  'markets/m35': true,
  'markets/m50': true,
};
