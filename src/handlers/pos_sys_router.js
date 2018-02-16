const servePosSysRoute = (req,res)=>{
  let filePath = './src/models/position_system.js';
  let fileContent = req.app.fs.readFileSync(filePath,'utf8');
  res.send(fileContent);
};

exports.servePosSysRoute = servePosSysRoute;
