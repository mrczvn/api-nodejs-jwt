const http = require('http');
const app = require('./app');
const port = process.on.PORT || 9000;

const server = http.createServer(app);

server.listen(port);
