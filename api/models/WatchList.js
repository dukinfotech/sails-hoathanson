module.exports = {
  tableName: 'watchlist',
  migrate: 'alter',
  attributes: {
    list: {type: 'string'},
    user_id: {
      model: 'user'
    }
  }
};
