module.exports = {
  tableName: 'watchlist',
  migrate: 'alter',
  attributes: {
    list: {type: 'string'},
    user_id: {
      model: 'user'
    }
  },
  async update(id, watchlist) {
    watchlist = JSON.stringify(watchlist);
    var sql = `UPDATE ${this.tableName} SET list = '${watchlist}' WHERE id = $1`;
    await sails.sendNativeQuery(sql, [id]);
  }
};
