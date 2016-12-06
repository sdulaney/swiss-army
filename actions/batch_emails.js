//'use strict';
var _ = require('underscore');
var fs = require('fs');

module.exports = function (phantomInstance, file) {

    // Email column
    var emails = [];

    if(typeof require !== 'undefined') var XLSX = require('xlsx');
    var workbook = XLSX.readFile( './files/' + file );
    // Get worksheet in workbook
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];
    var sheet_name_list = workbook.SheetNames;
    // sheet_name_list.forEach(function(y) { /* iterate through sheets */
    //   var worksheet = workbook.Sheets[y];
    //   for (z in worksheet) {
    //     /* all keys that do not begin with "!" correspond to cell addresses */
    //     if(z[0] === '!' && JSON.stringify(worksheet[z].v) === 'AF255' ) continue;
    //     console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
    //   }
    // });

    var range = {s:{c:0, r:0}, e:{c:0, r:46}};
    for(var R = range.s.r; R <= range.e.r; ++R) {
      for(var C = range.s.c; C <= range.e.c; ++C) {
        var cell_address = XLSX.utils.encode_cell({c:C, r:R});
        var desired_cell = worksheet[cell_address];
        if(desired_cell.v != 'BLANK'){
            var desired_value = desired_cell.v;
            console.log(desired_value);
        }
        else {
            
        }
      }
    }









    phantomInstance.close();
};
