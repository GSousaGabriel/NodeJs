const http= require('http');

const server= http.createServer((req, res)=>{
    //here it runs forever, since we don't stop the listener
    console.log(req.url, req.method, req.headers)
    //here it stops and don't log anything
    process.exit()
});

server.listen(3000); 