const http= require('http');

const server= http.createServer((req, res)=>{

    console.log(req)
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My first Page</title></head>');
    res.write('<body><h2>Hello from node server!</h2></body>');
    res.write('</html>');
    res.end();
});

server.listen(3000); 