'use strict';
let https = require('https'),
  http = require('http');
  
const ISBucketKey = 'WQN3VTK65D6Q';
const ISAccessKey = '0XPJWgcTT7YeDSmfT2VBrlbpTgli3nCQ'; 

var api_key="8b2599154b4553c9f6cacaed0310ed03";
var bankingAppHostname="api.reimaginebanking.com";
var customerDetails={};
    


exports.handler = (event, context, callback) => {
  getCustomerDetails((error, data) =>
  {
    if (error) {
      context.fail();
    } else {
      let isRequestBody = [
        {
          'key': 'Customer  ID',
          'value': data._id
        },
        {
          'key': 'Customer Name',
          'value': data.first_name+" "+data.last_name
        },
        
      ];
      
      sendToInitialState(ISAccessKey, isRequestBody, callback);
    }
  });
};

function getCustomerDetails(){
    const req= http.request({
    hostname:bankingAppHostname,
    path:"/enterprise/customers?key="+api_key,
    method:'GET',
    port:80
   },(res)=> {
    let body='';
    console.log('Status:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.log('Successfully finished processing HTTP response');
      body = JSON.parse(body);
      callback(null, body.results[0]);
     });
   });
     req.on('error', callback);
     req.end();
}

function sendToInitialState(accessKey, data, callback) {
  const req = https.request({
    hostname: 'groker.initialstate.com',
    port: '443',
    path: '/api/events',
    method: 'POST',
    headers: {
      'X-IS-AccessKey': accessKey,
      'X-IS-BucketKey': ISBucketKey,
      'Content-Type': 'application/json',
      'Accept-Version': '~0'
    }
  }, (res) => {
    let body = '';
    console.log('Status:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.log('Successfully processed HTTPS response');
      if (res.headers['content-type'] === 'application/json') {
        body = JSON.parse(body);
      }
      callback(null, body);
    });
  });
  req.on('error', callback);
  req.end(JSON.stringify(data));
}