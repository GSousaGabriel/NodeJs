const users=['Gabriel', 'Roger', 'Bruna'];

const requestHandler= (req, res)=>{
    const url= req.url;
    const method= req.method;
    if(url=== "/users"){
        res.write('<html>');
        res.write('<head><title>All users</title></head>');
        res.write('<body><h2>Here are the users:</h2><br><ul>');
        for(let index in users){
            if(users[index]!= undefined && users[index]!= ""){
                res.write(`<li>${users[index]}</li>`);
            }
        }
        res.write('</ul><form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Register new</button></form></body>');
        res.write('</html>');
        return res.end();
    }
    if(url=== "/create-user" && method=== "POST"){
        const body= [];

        req.on('data', (data)=>{
            body.push(data)
        });
        return req.on('end', ()=>{
            const parsedBody= Buffer.concat(body).toString();
            const username= parsedBody.split("=")[1];
            users.push(username);
            console.log(username);
            res.statusCode= 302;
            res.setHeader('Location', '/users');
            return res.end();
        });
    }
    res.write('<html>');
    res.write('<head><title>Welcome</title></head>');
    res.write('<body><h2>Welcome!</h2><form action="/users" method="POST"><button type="submit">List users</button><form></body>');
    res.write('</html>');
    return res.end();
}

module.exports= requestHandler;