const timeStamp = require("./time").timeStamp;
const fs = require('fs');

const toJsonString = function(data){
  return JSON.stringify(data,null,2);
};

const logRequest = function(req,res,next){
  const text = ["------------------------------",
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toJsonString(req.headers)}`,
    `COOKIES=> ${toJsonString(req.cookies)}`,
    `BODY=> ${toJsonString(req.body)}`,""].join("\n");
  fs.appendFile("./log/request.log",text,() => {/*do nothing*/});
  console.log(`${req.method} ${req.url}`);
  next();
};

exports.logRequest = logRequest;
