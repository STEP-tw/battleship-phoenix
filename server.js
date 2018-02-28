const http = require("http");
const app = require("./app");
const PORT = process.env.PORT || 8000;

let server = http.createServer(app);
server.on("error",err=>console.log(`***error*** ${err.message}`));
server.listen(PORT,()=>console.log(`Server is listening at ${PORT}`));
