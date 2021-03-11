/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  'GET /register': { action: 'auth/show-register' },
  'POST /register': { action: 'auth/register' },
  'GET /login': { action: 'auth/show-login' },
  'POST /login': { action: 'auth/login' },
  'POST /logout': { action: 'auth/logout' },
  // //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  // //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  // //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝
  'GET /': { action: 'pages/home' },
  'GET /markets/m10': { action: 'pages/m10' },
  'GET /api/markets/m10-1-change': { action: 'markets/m10-1/change' },
  'GET /api/markets/m10-1-mcdx': { action: 'markets/m10-1/mcdx' },
  'GET /api/markets/m10-1-p2vn30': { action: 'markets/m10-1/p2vn30' },
  'GET /api/markets/m10-2-change': { action: 'markets/m10-2/change' },
  'GET /api/markets/m10-2-mcdx': { action: 'markets/m10-2/mcdx' },
  'GET /api/markets/m10-2-p2vn30': { action: 'markets/m10-2/p2vn30' },
  'GET /api/markets/m10-2-datetime': { action: 'markets/m10-2/datetime' },

  'GET /markets/m15': { action: 'pages/m15' },
  'GET /api/markets/m15': { action: 'markets/m15' },
  'GET /markets/m16': { action: 'pages/m16' },
  'GET /api/markets/m16': { action: 'markets/m16' },
  'GET /markets/m20': { action: 'pages/m20' },
  'GET /api/markets/m20': { action: 'markets/m20' },
  // 'GET /welcome/:unused?':   { action: 'dashboard/view-welcome' },

  // 'GET /faq':                { action:   'view-faq' },
  // 'GET /legal/terms':        { action:   'legal/view-terms' },
  // 'GET /legal/privacy':      { action:   'legal/view-privacy' },
  // 'GET /contact':            { action:   'view-contact' },

  // 'GET /email/confirm':      { action: 'entrance/confirm-email' },
  // 'GET /email/confirmed':    { action: 'entrance/view-confirmed-email' },

  // 'GET /login':              { action: 'entrance/view-login' },
  // 'GET /password/forgot':    { action: 'entrance/view-forgot-password' },
  // 'GET /password/new':       { action: 'entrance/view-new-password' },

  // 'GET /account':            { action: 'account/view-account-overview' },
  // 'GET /account/password':   { action: 'account/view-edit-password' },
  // 'GET /account/profile':    { action: 'account/view-edit-profile' },


  // //  ╔╦╗╦╔═╗╔═╗  ╦═╗╔═╗╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗   ┬   ╔╦╗╔═╗╦ ╦╔╗╔╦  ╔═╗╔═╗╔╦╗╔═╗
  // //  ║║║║╚═╗║    ╠╦╝║╣  ║║║╠╦╝║╣ ║   ║ ╚═╗  ┌┼─   ║║║ ║║║║║║║║  ║ ║╠═╣ ║║╚═╗
  // //  ╩ ╩╩╚═╝╚═╝  ╩╚═╚═╝═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝  └┘   ═╩╝╚═╝╚╩╝╝╚╝╩═╝╚═╝╩ ╩═╩╝╚═╝
  // '/terms':                   '/legal/terms',
  // '/logout':                  '/api/v1/account/logout',


  // //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  // //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  // //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝
  // // …


  // //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  // //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  // //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // // Note that, in this app, these API endpoints may be accessed using the `Cloud.*()` methods
  // // from the Parasails library, or by using those method names as the `action` in <ajax-form>.
  // '/api/v1/account/logout':                           { action: 'account/logout' },
  // 'PUT   /api/v1/account/update-password':            { action: 'account/update-password' },
  // 'PUT   /api/v1/account/update-profile':             { action: 'account/update-profile' },
  // 'PUT   /api/v1/account/update-billing-card':        { action: 'account/update-billing-card' },
  // 'PUT   /api/v1/entrance/login':                        { action: 'entrance/login' },
  // 'POST  /api/v1/entrance/signup':                       { action: 'entrance/signup' },
  // 'POST  /api/v1/entrance/send-password-recovery-email': { action: 'entrance/send-password-recovery-email' },
  // 'POST  /api/v1/entrance/update-password-and-login':    { action: 'entrance/update-password-and-login' },
  // 'POST  /api/v1/deliver-contact-form-message':          { action: 'deliver-contact-form-message' },
  // 'POST  /api/v1/observe-my-session':                 { action: 'observe-my-session', hasSocketFeatures: true },

};
