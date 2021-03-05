module.exports = async function (req, res, proceed) {
  res.locals.layout = 'layouts/default';
  return proceed();
};
