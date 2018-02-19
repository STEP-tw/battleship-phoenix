class Mockfs{
  constructor(){
    this.files = {};
  }
  addFile(fileName,content){
    this.files[fileName] = content || '';
  }
  readFileSync(fileName){
    return this.files[fileName];
  }
  existsSync(fileName){
    return Object.keys(this.files).includes(fileName);
  }
}

module.exports = Mockfs;
