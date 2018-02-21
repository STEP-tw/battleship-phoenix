const servePosSysRoute = (req, res) => {
  let filePath = './src/models/position_system.js';
  let fileContent = req.app.fs.readFileSync(filePath, 'utf8');
  fileContent = fileContent.split('\n').slice(0, -2).join('\n');
  res.send(fileContent);
};

exports.servePosSysRoute = servePosSysRoute;
