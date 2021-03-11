$('#minAtv5, #maxAtv5').keyup( function() {
  datatable.draw();
});

$.fn.dataTable.ext.search.push(
  function( settings, data, dataIndex ) {
    var atv5_index = typeof(ATV5Index) !== 'undefined' ? ATV5Index : 2;
    let min = parseInt($('#minAtv5').val(), 10);
    let max = parseInt($('#maxAtv5').val(), 10);
    let ATV5 = parseFloat(data[atv5_index]) || 0;

    if ((isNaN(min) && isNaN(max)) ||
          (isNaN(min) && ATV5 <= max) ||
          (min <= ATV5 && isNaN(max)) ||
          (min <= ATV5 && ATV5 <= max))
      return true;
    return false;
  }
);

setInterval(() => {
  datatable.ajax.reload();
}, 60000);