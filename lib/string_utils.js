var _ = require('underscore');

exports.titleCase = function( str ) {
  return str.toLowerCase().split(' ').map(function(word) {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
};

exports.formatAllCells = function( file, fxn ) {
    // Read the file
    if(typeof require !== 'undefined') XLSX = require('xlsx');
    var workbook = XLSX.readFile( file );
    // Get worksheet in workbook
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];
    // Generate file as JSON
    var cellObjects = XLSX.utils.sheet_to_json( worksheet );
    console.log ( cellObjects );
    // Sanitize all values in object array
    // TODO: Apply function to each value properly
    cellObjects = _.each(_.mapObject(cellObjects, function (value, key) {
        if (_.isUndefined(value) == false && value != '') {
            return [ key, fxn(value) ]
        }
        else {
            value = '';
        }
    }));

    // function datenum(v, date1904) {
    // 	if(date1904) v+=1462;
    // 	var epoch = Date.parse(v);
    // 	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
    // }
    // // https://gist.github.com/SheetJSDev/88a3ca3533adf389d13c
    // function sheet_from_array_of_arrays(data, opts) {
    // 	var ws = {};
    // 	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
    // 	for(var R = 0; R != data.length; ++R) {
    // 		for(var C = 0; C != data[R].length; ++C) {
    // 			if(range.s.r > R) range.s.r = R;
    // 			if(range.s.c > C) range.s.c = C;
    // 			if(range.e.r < R) range.e.r = R;
    // 			if(range.e.c < C) range.e.c = C;
    // 			var cell = {v: data[R][C] };
    // 			if(cell.v == null) continue;
    // 			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
    //
    // 			if(typeof cell.v === 'number') cell.t = 'n';
    // 			else if(typeof cell.v === 'boolean') cell.t = 'b';
    // 			else if(cell.v instanceof Date) {
    // 				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
    // 				cell.v = datenum(cell.v);
    // 			}
    // 			else cell.t = 's';
    //
    // 			ws[cell_ref] = cell;
    // 		}
    // 	}
    // 	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    // 	return ws;
    // }
    // var ws_name = "SheetJS";
    // function Workbook() {
    // 	if(!(this instanceof Workbook)) return new Workbook();
    // 	this.SheetNames = [];
    // 	this.Sheets = {};
    // }
    // TODO: Format JSON to an array of arrays for easy conversion back to XSLX with sheet_from_array_of_arrays
    // data = _.each( cellObjects, function( obj ) {
    //     return _.keys( obj );
    // });
    // var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
    // // Add worksheet to workbook
    // wb.SheetNames.push(ws_name);
    // wb.Sheets[ws_name] = ws;
    // // Write file
    // XLSX.writeFile(wb, 'test.xlsx');
    console.log( cellObjects );
};

exports.sanitizeString = function( str ) {
    // if (_.isUndefined(str) == false && str != '') {
    //     return str.trim().replace(/\s+/g, ' '); //
    // }
    // else {
    //      str = '';
    // }
    return "false";
};
