const http = require('http');
const require = require('./routes');


const server = http.createServer((req,res) => {
    const url = req.url;
    const method = req.method;
    
});

server.listen(3000)