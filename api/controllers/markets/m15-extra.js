module.exports = {
  fn: async function () {
    var extra = this.req.param('extra');
    var listId;
    switch (extra) {
      case 'vn30':
        listId = 1;
        break;
      case 'bds':
        listId = 2;
        break;
      case 'tcnh':
        listId = 3;
        break;
      case 'dk':
        listId = 4;
        break;
      case '5':
        listId = 5;
        break;
      case '6':
        listId = 6;
        break;
    }
    var data = await M15Extra.getData(listId);
    return this.res.json({data});
  }
};
