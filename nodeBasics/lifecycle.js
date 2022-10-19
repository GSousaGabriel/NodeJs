const http= require('http');

const server= http.createServer((req, res)=>{
    //here it runs forever, since we don't stop the listener
    console.log(req)
    //here it stops and don't log anything
    //process.exit()
});

server.listen(3000); 