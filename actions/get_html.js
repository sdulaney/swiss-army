// get-page.js: request webpage with caching using https://github.com/alltherooms/cached-request
'use strict';

var cheerio = require('cheerio');

// Set up cached-request
var request = require('request')
,   cachedRequest = require('cached-request')(request)
,   cacheDirectory = "./cache";
cachedRequest.setCacheDirectory(cacheDirectory);
cachedRequest.setValue('ttl', 157784760000);    // ttl in milliseconds

// Use cached-request
module.exports = function (phantomInstance, url) {

    if (!url || typeof url !== 'string') {
      throw 'You must specify a url to gather links';
    }
    var fetched_html = '';
    // Return a single result object with properties for
    // whatever intelligence you want to derive from the page
    // var result = {
    //   phones: [],
    //   emails: []
    // };
    console.log('Getting html from: ', url);
    cachedRequest({ url:url }, function (error, response, body) {
        if (!error) {
            console.log('Request successful');
            var $ = cheerio.load(body);
            fetched_html = $.html();
            var emails = fetched_html.replace(/\s+/g, " ").split('var p1 = ');
            for(var i=1; i < emails.length; i++){
                var result = emails[i].split(';')[0] + emails[i].split('var p2 = ')[1].split(';')[0] + emails[i].split('var p3 = ')[1].split(';')[0];
                console.log(result.replace(/\"/g,'').replace(/' '/g, ''));
            }
        }
        else {
          console.log("We’ve encountered an error: " + error);
        }
    });
    //return fetched_html;
};
