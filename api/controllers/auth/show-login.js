module.exports = async function (req, res) {
  if (req.session.me) {
    res.redirect('/');
  }
  res.locals.layout = 'layouts/auth';
  return res.render('pages/auth/login');
};
