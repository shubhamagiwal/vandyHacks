var http=require("http");

var api_key="8b2599154b4553c9f6cacaed0310ed03";
var bankingAppHostname="api.reimaginebanking.com";
var customerDetails={};

http.request({
    hostname:bankingAppHostname,
    path:"/enterprise/customers?key="+api_key,
    method:'GET',
    port:80
   },function(response){
       var body='';
       response.on('data',function(d){
           body=body+d;
       });

        response.on('end',function(d){
           var bodyJson=JSON.parse(body);
           customerDetails=bodyJson.results[0];
           console.log(customerDetails);
       });
       response.on('error',function(err){
           console.log(err);
       })
   }).end();

