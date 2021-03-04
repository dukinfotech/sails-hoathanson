module.exports = async function (req, res) {
  if (req.me) {
    return {redirect: '/'};
  }

  var thisYear = (new Date).getFullYear();
  res.locals.layout = 'layouts/auth';
  return res.render('pages/auth/register', {thisYear});
};
