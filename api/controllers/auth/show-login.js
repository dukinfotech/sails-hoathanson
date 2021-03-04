module.exports = async function (req, res) {
  if (req.me) {
    return {redirect: '/'};
  }
  res.locals.layout = 'layouts/auth';
  return res.render('pages/auth/login');
};
