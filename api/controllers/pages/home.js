module.exports = async function (req, res) {
  if (req.me) {
    return {redirect: '/'};
  }
  return res.render('pages/home');
};
