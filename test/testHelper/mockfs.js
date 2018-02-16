let mockfs = {
  readFileSync : function(path,encoding){
    if(path == './src/models/position_system.js'){
      return "positionSystemContent";
    }
  }
};

module.exports = mockfs;
