module.exports = async function (req, res) {
  if (req.me) {
    return {redirect: '/'};
  }
  res.locals.layout = 'layouts/layout';
  return res.render('pages/home');
};
