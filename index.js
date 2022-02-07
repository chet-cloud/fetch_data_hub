'use strict';

const express = require('express');
const path = require('path');
const { createServer } = require('http');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));
const server = createServer(app);

require('./lib/websocket')(server)

//require('./lib/jobs')()

app.get('/test', async (req, res) => {
    const fetch_test = require('./fetch/test');
    const result = await fetch_test("", "", "")
    res.json(result)
})

app.get('/stream', function (req, res, next) {
    //when using text/plain it did not stream
    //without charset=utf-8, it only worked in Chrome, not Firefox
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
  
    res.write("Thinking...");
    sendAndSleep(res, 1);
  });
  
  
  var sendAndSleep = function (response, counter) {
    if (counter > 50) {
      response.end();
    } else {
      response.write(" ;i=" + counter);
      counter++;
      setTimeout(function () {
        sendAndSleep(response, counter);
      }, 1000)
    };
  };



  var Readable = require('stream').Readable;
var rs = Readable();


app.get('/report', function(req,res) {
    
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/csv');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Header to force download
    //res.setHeader('Content-disposition', 'attachment; filename=Report.csv');

    
    rs.pipe(res);

    rs.push("USERID,NAME,FBID,ACCOUNT,SUBSCRIPTION,PRICE,STATE,TIMEPERIOD\n");

    for (var i = 0; i < 10; i++) {
        rs.push("23,John Doe,1234,500,SUBSCRIPITON,100,ACTIVE,30\n");
    }

    
    rs.push(null);
});  


server.listen(8080, function () {
    console.log('Listening on http://localhost:8080');
});
