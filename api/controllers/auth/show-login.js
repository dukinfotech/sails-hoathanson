module.exports = async function (req, res) {
  if (req.user) {
    res.redirect('/');
  }
  res.locals.layout = 'layouts/auth';
  return res.render('pages/auth/login');
};
