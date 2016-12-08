//'use strict';
var _ = require('underscore');
var fs = require('fs');

// from thatsthem_emails
var cheerio = require('cheerio');
// Set up cached-request
var request = require('request')
,   cachedRequest = require('cached-request')(request)
,   cacheDirectory = "./cache";
cachedRequest.setCacheDirectory(cacheDirectory);
cachedRequest.setValue('ttl', 157784760000);    // ttl in milliseconds, 5 years




module.exports = function (phantomInstance, file) {

    // Email column
    var email_column = [];

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
    //     //console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
    //   }
    // });

    var range = {s:{c:0, r:0}, e:{c:0, r:46}};
    for(var R = range.s.r; R <= range.e.r; ++R) {
      for(var C = range.s.c; C <= range.e.c; ++C) {
        var cell_address = XLSX.utils.encode_cell({c:C, r:R});
        var desired_cell = worksheet[cell_address];
        if(desired_cell.v != 'BLANK'){
            var desired_address = desired_cell.v;
            //console.log(desired_address);
            var column_two_cell_address = XLSX.utils.encode_cell({c:C+1, r:R});
            var desired_cell_two = worksheet[column_two_cell_address];
            if(desired_cell_two.v != 'BLANK'){
                var desired_address_two = desired_cell_two.v;
                //console.log(desired_address_two);
            }
            // Consider trimming and removing consecutive whitespace later, causes error when called on string for now
            var cell_url = 'https:\/\/thatsthem.com/advanced-results?d_first=&d_mid=&d_last=&d_email=&d_phone=&d_fulladdr=' + desired_address + '&d_state=&d_city=&d_zip=' + desired_address_two;
            //console.log(cell_url);
            // Grab the URLs
            //console.log('Getting html from: ', cell_url);
            cachedRequest({ url:cell_url }, function (error, response, body) {
                var fetched_emails = [];
                if (!error) {
                    //console.log('Request successful');
                    var $ = cheerio.load(body);
                    var fetched_html = $.html();
                    // Parse scrambled emails
                    var emails = fetched_html.replace(/\s+/g, " ").split('var p1 = ');
                    if(emails.length > 0){
                        for(var i=1; i < emails.length; i++){
                            if(emails[i].includes('var p2 = ') && emails[i].includes('var p3 = ') ) {
                                var email = emails[i].split(';')[0] + emails[i].split('var p2 = ')[1].split(';')[0] + emails[i].split('var p3 = ')[1].split(';')[0];
                                fetched_emails.push(email.replace(/\"/g,'').replace(/' '/g, ''));

                                //console.log(email.replace(/\"/g,'').replace(/' '/g, ''));
                            }
                        }
                    }
                    //console.log(fetched_emails.join(';'));
                    email_column.push(fetched_emails.join(';'));
                }
                else {
                  //console.log("We’ve encountered an error: " + error);
                }
            });
        }
        else {
            // Add placeholder row to align with spreadsheet
            email_column.push('BLANK');
        }
      }
      //console.log(email_column);
    }

    for(var i = 0; i < email_column.length;i++){
        console.log(email_column[i]);

    }






    phantomInstance.close();
};
